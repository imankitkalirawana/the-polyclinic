import { create } from 'zustand';

type DateType = Date | null;

interface AppointmentStore {
  selectedDate: DateType;
  setSelectedDate: (date: DateType) => void;
}

export const useAppointmentDate = create<AppointmentStore>((set) => ({
  selectedDate: null,
  setSelectedDate: (date: DateType) => set({ selectedDate: date }),
}));
