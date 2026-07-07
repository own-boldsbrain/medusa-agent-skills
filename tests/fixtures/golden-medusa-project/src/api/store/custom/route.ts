import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Doing random business logic without validation, workflows, etc
  const body = req.body;
  res.json({ success: true });
};
