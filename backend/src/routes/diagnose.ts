import express, { type Response } from "express";
import diagnoseService from "../services/diagnoseService.ts";
import type { DiagnoseEntry } from "../types.ts";

const router = express.Router();

router.get("/", (_req, res: Response<DiagnoseEntry[]>) => {
  res.send(diagnoseService.getEntries());
});

export default router;
