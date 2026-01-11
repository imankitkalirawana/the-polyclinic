import { CreateAppointmentType } from '@/services/client/appointment';

type CreateAppointmentMeta = {
  currentStep: number;
  showConfirmation: boolean;
  showReceipt: boolean;
  createNewPatient: boolean;
  knowYourDoctor: boolean;
};

export type CreateAppointmentFormValues = {
  appointment: CreateAppointmentType;
  meta: CreateAppointmentMeta;
};
