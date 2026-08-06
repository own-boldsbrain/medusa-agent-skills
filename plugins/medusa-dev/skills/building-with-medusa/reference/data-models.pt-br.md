# Modelos de dados

Os modelos de dados representam tabelas no banco de dados. Use a Linguagem de Modelagem de Dados (DML) do Medusa para defini-los.

## Tipos de propriedade

```typescript
import { model } from "@medusajs/framework/utils"

const MyModel = model.define("my_model", {
  // Primary key (required)
  id: model.id().primaryKey(),

  // Text
  name: model.text(),
  description: model.text().nullable(),

  // Numbers
  quantity: model.number(),
  price: model.bigNumber(), // For high precision

  // Boolean
  is_active: model.boolean().default(true),

  // Enum
  status: model.enum(["draft", "published", "archived"]).default("draft"),

  // Date/Time
  published_at: model.dateTime().nullable(),

  // JSON (for flexible data)
  metadata: model.json().nullable(),

  // Array
  tags: model.array().nullable(),
})
```

## Modificadores de propriedade

```typescript
model.text() // Required by default
model.text().nullable() // Allow null values
model.text().default("value") // Set default value
model.text().unique() // Unique constraint
model.text().primaryKey() // Set as primary key
```

## Relações dentro de um módulo

Defina relações entre modelos de dados no mesmo módulo:

```typescript
// src/modules/blog/models/post.ts
import { model } from "@medusajs/framework/utils"
import { Comment } from "./comment"

export const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
  comments: model.hasMany(() => Comment, {
    mappedBy: "post",
  }),
})

// src/modules/blog/models/comment.ts
import { model } from "@medusajs/framework/utils"
import { Post } from "./post"

export const Comment = model.define("comment", {
  id: model.id().primaryKey(),
  content: model.text(),
  post: model.belongsTo(() => Post, {
    mappedBy: "comments",
  }),
})
```

## Tipos de relação

- `model.hasMany()` - Um para muitos (uma postagem tem muitos comentários)
- `model.belongsTo()` - Muitos para um (um comentário pertence a uma postagem)
- `model.hasOne()` - Um para um
- `model.manyToMany()` - Muitos para muitos

## Propriedades automáticas

Os modelos de dados incluem automaticamente:

- `created_at` - Carimbo de data/hora de criação
- `updated_at` - Carimbo de data/hora da última atualização
- `deleted_at` - Carimbo de data/hora da exclusão temporária

**Importante**: Nunca adicione essas propriedades explicitamente às definições do seu modelo.

## Gerar e executar migrações após alterações

Após fazer alterações em um modelo de dados, como adicionar uma propriedade, você DEVE gerar as migrações ANTES de executá-las:

```bash
npx medusa db:generate blog
npx medusa db:migrate
```
