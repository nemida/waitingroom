import { useState, SyntheticEvent } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

import { Gender, PatientFormValues } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: PatientFormValues) => void;
}

const AddPatientForm = ({ onCancel, onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [ssn, setSsn] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.Other);

  const handleGenderChange = (event: SelectChangeEvent<Gender>) => {
    setGender(event.target.value as Gender);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({ name, occupation, ssn, dateOfBirth, gender });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      <TextField
        label="Name"
        fullWidth
        required
        value={name}
        onChange={({ target }) => setName(target.value)}
      />
      <TextField
        label="Social security number"
        fullWidth
        required
        value={ssn}
        onChange={({ target }) => setSsn(target.value)}
      />
      <TextField
        label="Date of birth"
        type="date"
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        value={dateOfBirth}
        onChange={({ target }) => setDateOfBirth(target.value)}
      />
      <TextField
        label="Occupation"
        fullWidth
        required
        value={occupation}
        onChange={({ target }) => setOccupation(target.value)}
      />
      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select<Gender> value={gender} label="Gender" onChange={handleGenderChange}>
          {Object.values(Gender).map((g) => (
            <MenuItem key={g} value={g} sx={{ textTransform: "capitalize" }}>
              {g}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Button color="secondary" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AddPatientForm;
