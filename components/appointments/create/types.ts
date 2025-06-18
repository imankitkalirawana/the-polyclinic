import { AppointmentType } from '@/types/appointment';

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
