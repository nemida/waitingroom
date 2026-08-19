import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

import { NonSensitivePatient, PatientFormValues } from "../../types";
import AddPatientModal from "../AddPatientModal";
import patientService from "../../services/patients";

interface Props {
  patients: NonSensitivePatient[];
  setPatients: React.Dispatch<React.SetStateAction<NonSensitivePatient[]>>;
}

const PatientListPage = ({ patients, setPatients }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string>();

  const closeModal = () => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const patient = await patientService.create(values);
      setPatients(patients.concat(patient));
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const msg = e.response?.data;
        setError(typeof msg === "string" ? msg.replace("Something went wrong. Error: ", "") : "Unrecognized error");
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Patients
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>Occupation</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} hover>
                <TableCell>
                  <Link
                    to={`/patients/${patient.id}`}
                    style={{ textDecoration: "none", color: "inherit", fontWeight: 500 }}
                  >
                    {patient.name}
                  </Link>
                </TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>{patient.gender}</TableCell>
                <TableCell>{patient.occupation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setModalOpen(true)}>
        Add new patient
      </Button>

      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
    </Box>
  );
};

export default PatientListPage;
