import { createStep, createWorkflow } from "@medusajs/framework/workflows-sdk";

export const createOrderStep = createStep(
  "create-order-step",
  async (input, { container }) => {
    return { id: "order_123" };
  },
  async (stepReturn, { container }) => {
    // Compensation provided -> safe!
  }
);

export const createOrderWorkflow = createWorkflow(
  "create-order",
  function (input) {
    const order = createOrderStep(input);
    return order;
  }
);
