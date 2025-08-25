import { AppointmentType } from '@/types/client/appointment';

export type CreateAppointmentType = {
  aid?: number;
  date: Date;
  type: AppointmentType['type'];
  additionalInfo: AppointmentType['additionalInfo'];
  patient?: number;
  doctor?: number;
  previousAppointment?: number;
  knowYourDoctor?: boolean;
};

type CreateAppointmentMeta = {
  currentStep: number;
  showConfirmation: boolean;
  showReceipt: boolean;
  createNewPatient: boolean;
};

export type CreateAppointmentFormValues = {
  appointment: CreateAppointmentType;
  meta: CreateAppointmentMeta;
};
