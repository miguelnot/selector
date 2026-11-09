import { Router } from "express";
import { policies, policyTypes } from "../data/policies.js";

const router = Router();

router.get("/types", (_req, res) => {
  res.json(policyTypes);
});

router.get("/", (req, res) => {
  const { type, maxPremium } = req.query;
  let result = [...policies];
  if (type && type !== "all") {
    result = result.filter((p) => p.type === type);
  }
  if (maxPremium) {
    const limit = Number(maxPremium);
    if (!Number.isNaN(limit)) {
      result = result.filter((p) => p.premium <= limit);
    }
  }
  res.json(result);
});

router.get("/:id", (req, res) => {
  const policy = policies.find((p) => p.id === req.params.id);
  if (!policy) return res.status(404).json({ error: "Póliza no encontrada" });
  res.json(policy);
});

export default router;