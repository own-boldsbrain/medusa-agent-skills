import ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { readAndParseFile, getFilesRecursively } from "./ast-utils.js";
import { DataModelInspectionDetail, DataModelField, DataModelRelationship } from "./types.js";

export function inspectModel(filePath: string, projectRoot: string): DataModelInspectionDetail | null {
  const parsed = readAndParseFile(filePath);
  if (!parsed) return null;
  const { sourceFile } = parsed;
  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, "/");

  // Extract module name from path, e.g. "src/modules/quote/models/quote.ts" -> "quote"
  const parts = relativePath.split("/");
  const modulesIdx = parts.indexOf("modules");
  let moduleName = "unknown";
  if (modulesIdx !== -1 && parts.length > modulesIdx + 1) {
    moduleName = parts[modulesIdx + 1];
  }

  let modelName = "";
  let tableName = "";
  const fields: DataModelField[] = [];
  const relationships: DataModelRelationship[] = [];

  function visit(node: ts.Node): void {
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer)) {
      const callExpr = node.initializer;
      
      let isModelDefine = false;
      if (ts.isPropertyAccessExpression(callExpr.expression)) {
        const obj = callExpr.expression.expression;
        const prop = callExpr.expression.name;
        if (ts.isIdentifier(obj) && obj.text === "model" && prop.text === "define") {
          isModelDefine = true;
        }
      }

      if (isModelDefine) {
        if (ts.isIdentifier(node.name)) {
          modelName = node.name.text;
        }
        
        if (callExpr.arguments.length > 0) {
          const firstArg = callExpr.arguments[0];
          if (ts.isStringLiteral(firstArg) || ts.isNoSubstitutionTemplateLiteral(firstArg)) {
            tableName = firstArg.text;
          }
        }

        if (callExpr.arguments.length > 1) {
          const secondArg = callExpr.arguments[1];
          if (ts.isObjectLiteralExpression(secondArg)) {
            for (const prop of secondArg.properties) {
              if (ts.isPropertyAssignment(prop) && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) {
                const fieldName = prop.name.text;
                let kind: DataModelField["kind"] = "unknown";
                let isPrimaryKey = false;
                let isNullable = false;
                
                const propText = prop.initializer.getText(sourceFile);
                if (propText.includes("primaryKey()")) isPrimaryKey = true;
                if (propText.includes("nullable()")) isNullable = true;
                
                if (propText.includes("model.id(")) kind = "id";
                else if (propText.includes("model.text(")) kind = "text";
                else if (propText.includes("model.number(")) kind = "number";
                else if (propText.includes("model.boolean(")) kind = "boolean";
                else if (propText.includes("model.dateTime(")) kind = "dateTime";
                else if (propText.includes("model.json(")) kind = "json";
                else if (propText.includes("model.enum(")) kind = "enum";
                
                // Relationships
                if (propText.includes("model.hasOne(") || propText.includes("model.belongsTo(") || 
                    propText.includes("model.hasMany(") || propText.includes("model.manyToMany(")) {
                  kind = "relationship";
                  
                  let relKind: DataModelRelationship["kind"] = "unknown";
                  if (propText.includes("model.hasOne(")) relKind = "hasOne";
                  if (propText.includes("model.belongsTo(")) relKind = "belongsTo";
                  if (propText.includes("model.hasMany(")) relKind = "hasMany";
                  if (propText.includes("model.manyToMany(")) relKind = "manyToMany";
                  
                  // Try to extract related model reference (e.g. () => RelatedModel)
                  let relatedRef = "unknown";
                  const match = propText.match(/\(\)\s*=>\s*([a-zA-Z0-9_]+)/);
                  if (match) {
                    relatedRef = match[1];
                  }

                  let mappedBy = undefined;
                  const mappedByMatch = propText.match(/mappedBy:\s*["']([^"']+)["']/);
                  if (mappedByMatch) {
                    mappedBy = mappedByMatch[1];
                  }

                  relationships.push({
                    kind: relKind,
                    related_model_reference: relatedRef,
                    mapped_by: mappedBy
                  });
                }

                fields.push({
                  name: fieldName,
                  kind,
                  primary_key: isPrimaryKey,
                  nullable: isNullable
                });
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (!tableName) {
    return null; // Not a model
  }

  // Find migrations for this module
  const moduleMigrationsDir = path.join(projectRoot, "src", "modules", moduleName, "migrations");
  let migrationFiles: string[] = [];
  if (fs.existsSync(moduleMigrationsDir)) {
    migrationFiles = getFilesRecursively(moduleMigrationsDir)
      .map(f => path.relative(projectRoot, f).replace(/\\/g, "/"));
  }

  return {
    module_name: moduleName,
    path: relativePath,
    model_name: modelName,
    table_name: tableName,
    fields,
    relationships,
    migration_files: migrationFiles
  };
}
