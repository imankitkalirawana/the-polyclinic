import { AppointmentType } from '@/types/appointment';
import { create } from 'zustand';

interface CalendarStore {
  appointment: AppointmentType | null;
  setAppointment: (appointment: AppointmentType) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  appointment: null,
  setAppointment: (appointment) => set({ appointment }),
}));
