import { AppointmentType } from '@/types/appointment';

export const views = ['month', 'week', 'day', 'schedule', 'year'];

export enum View {
  Month = 'month',
  Week = 'week',
  Day = 'day',
  Schedule = 'schedule',
  Year = 'year',
}

export interface MonthViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
}
