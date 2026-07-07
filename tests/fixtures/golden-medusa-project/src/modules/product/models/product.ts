import { model } from "@medusajs/framework/utils";

export const Product = model.define("product", {
  id: model.id().primaryKey(),
  title: model.text(),
});
