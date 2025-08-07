import { AppointmentType } from '@/types/appointment';

export type CreateAppointmentType = {
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
};

export type CreateAppointmentFormValues = {
  appointment: CreateAppointmentType;
  meta: CreateAppointmentMeta;
};
