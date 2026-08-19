import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import axios from "axios";

import patientService from "../../services/patients";
import {
  Diagnosis,
  Entry,
  Gender,
  HealthCheckEntry,
  HospitalEntry,
  NewEntry,
  OccupationalHealthcareEntry,
  Patient,
} from "../../types";
import HealthRatingBar from "../HealthRatingBar";
import AddEntryForm from "../AddEntryForm";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const genderIcon = (gender: Gender) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon fontSize="small" />;
    case Gender.Female:
      return <FemaleIcon fontSize="small" />;
    case Gender.Other:
      return <TransgenderIcon fontSize="small" />;
  }
};

interface DiagnosisListProps {
  codes: string[];
  getDiagnosis: (code: string) => Diagnosis | undefined;
}

const DiagnosisList = ({ codes, getDiagnosis }: DiagnosisListProps) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
    {codes.map((code) => {
      const diag = getDiagnosis(code);
      return (
        <Tooltip key={code} title={diag?.name ?? ""} placement="top">
          <Chip label={code} size="small" variant="outlined" />
        </Tooltip>
      );
    })}
  </Box>
);

interface EntryCardProps {
  entry: Entry;
  getDiagnosis: (code: string) => Diagnosis | undefined;
}

const HealthCheckCard = ({ entry, getDiagnosis }: { entry: HealthCheckEntry; getDiagnosis: (code: string) => Diagnosis | undefined }) => (
  <ListItem sx={{ display: "block", p: 0 }}>
    <Box sx={{ border: "1px solid", borderColor: "primary.light", borderRadius: 1, p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography fontWeight={600}>{entry.date}</Typography>
        <MonitorHeartIcon fontSize="small" color="primary" />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {entry.description}
      </Typography>
      <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <DiagnosisList codes={entry.diagnosisCodes} getDiagnosis={getDiagnosis} />
      )}
      <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
        {entry.specialist}
      </Typography>
    </Box>
  </ListItem>
);

const HospitalCard = ({ entry, getDiagnosis }: { entry: HospitalEntry; getDiagnosis: (code: string) => Diagnosis | undefined }) => (
  <ListItem sx={{ display: "block", p: 0 }}>
    <Box sx={{ border: "1px solid", borderColor: "error.light", borderRadius: 1, p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography fontWeight={600}>{entry.date}</Typography>
        <LocalHospitalIcon fontSize="small" color="error" />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {entry.description}
      </Typography>
      <Typography variant="body2">
        Discharged {entry.discharge.date} — {entry.discharge.criteria}
      </Typography>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <DiagnosisList codes={entry.diagnosisCodes} getDiagnosis={getDiagnosis} />
      )}
      <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
        {entry.specialist}
      </Typography>
    </Box>
  </ListItem>
);

const OccupationalCard = ({ entry, getDiagnosis }: { entry: OccupationalHealthcareEntry; getDiagnosis: (code: string) => Diagnosis | undefined }) => (
  <ListItem sx={{ display: "block", p: 0 }}>
    <Box sx={{ border: "1px solid", borderColor: "success.light", borderRadius: 1, p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography fontWeight={600}>{entry.date}</Typography>
        <WorkIcon fontSize="small" color="success" />
        <Typography variant="body2" color="text.secondary">{entry.employerName}</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {entry.description}
      </Typography>
      {entry.sickLeave && (
        <Typography variant="body2">
          Sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
        </Typography>
      )}
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <DiagnosisList codes={entry.diagnosisCodes} getDiagnosis={getDiagnosis} />
      )}
      <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
        {entry.specialist}
      </Typography>
    </Box>
  </ListItem>
);

const EntryCard = ({ entry, getDiagnosis }: EntryCardProps) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckCard entry={entry} getDiagnosis={getDiagnosis} />;
    case "Hospital":
      return <HospitalCard entry={entry} getDiagnosis={getDiagnosis} />;
    case "OccupationalHealthcare":
      return <OccupationalCard entry={entry} getDiagnosis={getDiagnosis} />;
    default:
      return assertNever(entry);
  }
};

interface PatientPageProps {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: PatientPageProps) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [entryError, setEntryError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Patient id is missing");
      return;
    }

    const fetchPatient = async () => {
      try {
        setPatient(await patientService.getById(id));
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          const msg = e.response?.data?.error ?? e.response?.data;
          setError(typeof msg === "string" ? msg : "Failed to fetch patient");
        } else {
          setError("Failed to fetch patient");
        }
      }
    };

    void fetchPatient();
  }, [id]);

  const getDiagnosis = (code: string) => diagnoses.find((d) => d.code === code);

  const handleAddEntry = async (entry: NewEntry) => {
    if (!id) return;
    setEntryError(null);
    try {
      const newEntry = await patientService.addEntry(id, entry);
      setPatient((prev) => prev ? { ...prev, entries: prev.entries.concat(newEntry) } : prev);
      setShowForm(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const data = e.response?.data;
        if (Array.isArray(data?.error)) {
          setEntryError(data.error.map((i: { message: string }) => i.message).join(", "));
        } else {
          const msg = data?.error ?? data;
          setEntryError(typeof msg === "string" ? msg : "Failed to add entry");
        }
      } else {
        setEntryError("Failed to add entry");
      }
    }
  };

  if (!patient && !error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!patient) return null;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography variant="h5" fontWeight={600}>
          {patient.name}
        </Typography>
        {genderIcon(patient.gender)}
      </Box>
      <Typography variant="body2" color="text.secondary">
        Date of birth: {patient.dateOfBirth}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        SSN: {patient.ssn}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Occupation: {patient.occupation}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        Entries
      </Typography>

      {patient.entries.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No entries recorded.
        </Typography>
      ) : (
        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {patient.entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} getDiagnosis={getDiagnosis} />
          ))}
        </List>
      )}

      {entryError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {entryError}
        </Alert>
      )}

      {showForm ? (
        <AddEntryForm
          diagnoses={diagnoses}
          onCancel={() => { setShowForm(false); setEntryError(null); }}
          onSubmit={handleAddEntry}
        />
      ) : (
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setShowForm(true)}>
          Add new entry
        </Button>
      )}
    </Box>
  );
};

export default PatientPage;
