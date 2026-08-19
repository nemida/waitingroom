import { useState, SyntheticEvent } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

import {
  Diagnosis,
  HealthCheckRating,
  NewEntry,
  NewHealthCheckEntry,
  NewHospitalEntry,
  NewOccupationalHealthcareEntry,
} from "../../types";

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

interface Props {
  diagnoses: Diagnosis[];
  onCancel: () => void;
  onSubmit: (entry: NewEntry) => void;
}

const healthRatingOptions: { value: HealthCheckRating; label: string }[] = [
  { value: HealthCheckRating.Healthy, label: "0 — Healthy" },
  { value: HealthCheckRating.LowRisk, label: "1 — Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "2 — High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "3 — Critical Risk" },
];

const AddEntryForm = ({ diagnoses, onCancel, onSubmit }: Props) => {
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const shared = {
      description,
      date,
      specialist,
      ...(diagnosisCodes.length > 0 ? { diagnosisCodes } : {}),
    };

    switch (entryType) {
      case "HealthCheck": {
        const entry: NewHealthCheckEntry = { ...shared, type: "HealthCheck", healthCheckRating };
        onSubmit(entry);
        break;
      }
      case "Hospital": {
        const entry: NewHospitalEntry = {
          ...shared,
          type: "Hospital",
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
        onSubmit(entry);
        break;
      }
      case "OccupationalHealthcare": {
        const entry: NewOccupationalHealthcareEntry = {
          ...shared,
          type: "OccupationalHealthcare",
          employerName,
          ...(sickLeaveStart && sickLeaveEnd
            ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } }
            : {}),
        };
        onSubmit(entry);
        break;
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 1, p: 2.5, mt: 2 }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        New Entry
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Entry type</InputLabel>
        <Select<EntryType>
          value={entryType}
          label="Entry type"
          onChange={(e) => setEntryType(e.target.value)}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Description"
          fullWidth
          required
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          required
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisChange}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => (selected as string[]).join(", ")}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} — {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {entryType === "HealthCheck" && (
          <FormControl fullWidth>
            <InputLabel>Health rating</InputLabel>
            <Select
              value={healthCheckRating}
              label="Health rating"
              onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}
            >
              {healthRatingOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {entryType === "Hospital" && (
          <>
            <TextField
              label="Discharge date"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              label="Discharge criteria"
              fullWidth
              required
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}

        {entryType === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer name"
              fullWidth
              required
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              label="Sick leave start"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
            />
            <TextField
              label="Sick leave end"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
            />
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button color="secondary" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Add entry
        </Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
