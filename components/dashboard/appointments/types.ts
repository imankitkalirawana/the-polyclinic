import { AppointmentType } from '@/models/Appointment';

export type ButtonConfig = {
  label: string;
  action: (item: AppointmentType) => void;
  color: 'primary' | 'danger' | 'success' | 'warning' | 'default';
  variant: 'solid' | 'flat' | 'bordered' | 'light';
  icon?: string;
  tooltip?: string;
  isIconOnly?: boolean;
};
