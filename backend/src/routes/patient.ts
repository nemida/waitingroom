import express, { type Request, type Response } from "express";
import patientService from "../services/patientService.ts";
import {
  newPatientEntrySchema,
  newEntrySchema,
  type PatientEntry,
  type NewPatientEntry,
  type NonSensitivePatientEntry,
  type NewEntry,
  type Entry,
} from "../types.ts";
import { errorMiddleware, NewPatientParser, NewEntryParser } from "../middleware.ts";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientService.getEntries());
});

router.get("/:id", (req: Request<{ id: string }>, res: Response<PatientEntry | { error: string }>) => {
  const patient = patientService.getEntryById(req.params.id);
  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }
  res.json(patient);
});

router.post(
  "/",
  NewPatientParser,
  (req: Request<unknown, unknown, NewPatientEntry>, res: Response<PatientEntry>) => {
    const entry = newPatientEntrySchema.parse(req.body);
    res.json(patientService.addEntry(entry));
  },
);

router.post(
  "/:id/entries",
  NewEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry | { error: string }>) => {
    const entry = newEntrySchema.parse(req.body);
    const newEntry = patientService.addEntryToPatient(req.params.id, entry);
    if (!newEntry) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.json(newEntry);
  },
);

router.use(errorMiddleware);

export default router;
