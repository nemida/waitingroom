import type { DiagnoseEntry } from "../types.ts";
import diagnosticData from "../../data/diagnoses.ts";

const getEntries = (): DiagnoseEntry[] => {
  return diagnosticData;
};

export default { getEntries };
