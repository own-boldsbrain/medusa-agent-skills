import { createStep, createWorkflow } from "@medusajs/framework/workflows-sdk";

export const createProductStep = createStep(
  "create-product-step",
  async (input, { container }) => {
    // Uses container -> strong signal
    // Name contains "create" -> mutational
    // No compensation provided -> unsafe!
    const svc = container.resolve("productModuleService");
    return { id: "prod_123" };
  }
);

export const createProductWorkflow = createWorkflow(
  "create-product",
  function (input) {
    const product = createProductStep(input);
    return product;
  }
);
