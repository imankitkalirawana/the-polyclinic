import { AppointmentType } from '@/models/Appointment';

export type AppointmentFormType = Omit<
  AppointmentType,
  | '_id'
  | 'aid'
  | 'status'
  | 'progress'
  | 'data'
  | 'previousAppointments'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
>;
