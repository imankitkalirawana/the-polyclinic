import { create } from 'zustand';

export type View = 'month' | 'week' | 'day' | 'schedule' | 'year';

interface CalendarStoreState {
  view: View;
  setView: (view: View) => void;
}

export const useCalendar = create<CalendarStoreState>((set) => ({
  view: 'month',
  setView: (view) => set({ view }),
}));
