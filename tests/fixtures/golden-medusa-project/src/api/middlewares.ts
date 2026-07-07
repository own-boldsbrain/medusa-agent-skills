import { defineMiddlewares, authenticate } from "@medusajs/medusa";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/safe",
      middlewares: [authenticate("admin", ["bearer", "session"])],
    },
  ],
});
