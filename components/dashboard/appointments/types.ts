import { AppointmentType } from '@/models/Appointment';
import { ButtonProps } from '@heroui/react';

export type ButtonConfig = {
  label: string;
  action: (item: AppointmentType) => void;
  color?: ButtonProps['color'];
  variant?: ButtonProps['variant'];
  icon: string;
  isIconOnly?: boolean;
  content?: React.ReactNode;
};

export type ActionType =
  | 'reschedule'
  | 'cancel'
  | 'delete'
  | 'edit'
  | 'reminder'
  | 'addToCalendar'
  | 'bulk-edit'
  | 'bulk-delete';
