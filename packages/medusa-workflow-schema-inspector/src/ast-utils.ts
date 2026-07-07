import ts from "typescript";
import * as fs from "fs";
import * as path from "path";

export function parseSourceFile(filePath: string, content?: string): ts.SourceFile {
  const fileContent = content !== undefined ? content : fs.readFileSync(filePath, "utf-8");
  return ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );
}

export function readAndParseFile(filePath: string): { content: string; sourceFile: ts.SourceFile } | null {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  const sourceFile = parseSourceFile(filePath, content);
  return { content, sourceFile };
}

export function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir);
  list.forEach((file: string) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}
