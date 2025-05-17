import { AppointmentType } from '@/models/Appointment';
import { ButtonProps } from '@heroui/react';

export type ActionType =
  | 'reschedule'
  | 'cancel'
  | 'delete'
  | 'edit'
  | 'reminder'
  | 'add-to-calendar'
  | 'new-tab'
  | 'bulk-cancel'
  | 'bulk-delete';

export type ButtonConfig = {
  label: string;
  action: (item: AppointmentType) => void;
  color?: ButtonProps['color'];
  variant?: ButtonProps['variant'];
  icon: string;
  isIconOnly?: boolean;
  content?: React.ReactNode;
};
