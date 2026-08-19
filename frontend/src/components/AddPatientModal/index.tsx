import { Alert, Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";

import { PatientFormValues } from "../../types";
import AddPatientForm from "./AddPatientForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => void;
  error?: string;
}

const AddPatientModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth open={modalOpen} onClose={onClose}>
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      <AddPatientForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default AddPatientModal;
