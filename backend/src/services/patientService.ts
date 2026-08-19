import type {
  NewPatientEntry,
  NonSensitivePatientEntry,
  PatientEntry,
  NewEntry,
  Entry,
} from "../types.ts";
import patientData from "../../data/patients.ts";
import { randomUUID } from "crypto";

const getEntries = (): NonSensitivePatientEntry[] => {
  return patientData.map(({ ssn: _ssn, entries: _entries, ...patient }) => patient);
};

const getEntryById = (id: string): PatientEntry | undefined => {
  return patientData.find((patient) => patient.id === id);
};

const addEntry = (entry: NewPatientEntry): PatientEntry => {
  const newEntry = { id: randomUUID(), ...entry, entries: [] };
  patientData.push(newEntry);
  return newEntry;
};

const addEntryToPatient = (patientId: string, entry: NewEntry): Entry | null => {
  const patient = patientData.find((p) => p.id === patientId);
  if (!patient) return null;

  const newEntry: Entry = { id: randomUUID(), ...entry };
  patient.entries.push(newEntry);
  return newEntry;
};

export default { getEntries, getEntryById, addEntry, addEntryToPatient };
