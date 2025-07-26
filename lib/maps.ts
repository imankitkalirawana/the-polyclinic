import { ButtonProps, ChipProps } from '@heroui/react';

export const genderMap: Record<string, string> = {
  male: 'fluent-emoji:male-sign',
  female: 'fluent-emoji:female-sign',
  other: 'fluent-emoji:transgender-symbol',
};

export const buttonColorMap: Record<string, ButtonProps['color']> = {
  cancel: 'danger',
  reschedule: 'warning',
  download: 'default',
  complete: 'success',
  accept: 'success',
};

export const ChipColorMap: Record<string, ChipProps['color']> = {
  booked: 'default',
  confirmed: 'success',
  'in-progress': 'warning',
  overdue: 'danger',
  completed: 'success',
  cancelled: 'danger',
};

export const statusColorMap: Record<string, string> = {
  booked: '#73CD7D',
  confirmed: '#73CD7D',
  cancelled: '#F31260',
  overdue: '#F31260',
  completed: '#10793C',
  'on-hold': '#936316',
};
