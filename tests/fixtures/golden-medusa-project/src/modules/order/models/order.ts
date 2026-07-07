import { model } from "@medusajs/framework/utils";

export const Order = model.define("order", {
  id: model.id().primaryKey(),
  status: model.text(),
});
