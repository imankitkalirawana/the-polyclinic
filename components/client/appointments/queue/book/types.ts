export type CreateAppointmentFormValues = {
  appointment: {
    patientId: string;
    doctorId: string;
    notes: string | null;
  };
  meta: {
    currentStep: number;
    showConfirmation: boolean;
    showReceipt: boolean;
    createNewPatient: boolean;
  };
};
