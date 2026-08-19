import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { Diagnosis, NonSensitivePatient } from "./types";
import patientService from "./services/patients";
import diagnosisService from "./services/diagnoses";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

const App = () => {
  const [patients, setPatients] = useState<NonSensitivePatient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void patientService.getAll().then(setPatients);
    void diagnosisService.getAll().then(setDiagnoses);
  }, []);

  return (
    <Router>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={600} sx={{ mt: 3, mb: 1 }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="outlined" size="small">
          Home
        </Button>
        <Divider sx={{ my: 2 }} />
        <Routes>
          <Route
            path="/"
            element={<PatientListPage patients={patients} setPatients={setPatients} />}
          />
          <Route
            path="/patients/:id"
            element={<PatientPage diagnoses={diagnoses} />}
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
