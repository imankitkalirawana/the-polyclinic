import { ButtonProps, ChipProps } from '@heroui/react';

export const genderMap: Record<string, string> = {
  male: 'fluent-emoji:male-sign',
  female: 'fluent-emoji:female-sign',
  other: 'fluent-emoji:transgender-symbol'
};

export const buttonColorMap: Record<string, ButtonProps['color']> = {
  cancel: 'danger',
  reschedule: 'warning',
  download: 'default',
  complete: 'success',
  accept: 'success'
};

export const ChipColorMap: Record<string, ChipProps['color']> = {
  booked: 'default',
  confirmed: 'success',
  'in-progress': 'warning',
  overdue: 'danger',
  completed: 'success',
  cancelled: 'danger'
};
