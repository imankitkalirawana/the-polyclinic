import { create } from 'zustand';
import { AppointmentType, ActionType } from '@/types/appointment';
import { Selection } from '@heroui/react';

interface AppointmentStoreState {
  appointment: AppointmentType | null;
  action: ActionType | null;
  keys: Selection | undefined;
  setAppointment: (appointment: AppointmentType | null) => void;
  setAction: (action: ActionType | null) => void;
  setKeys: (keys: Selection) => void;
  resetState: () => void;
  isTooltipOpen: boolean;
  setIsTooltipOpen: (isTooltipOpen: boolean) => void;
}

// Zustand store for appointment state
export const useAppointmentStore = create<AppointmentStoreState>((set) => ({
  appointment: null,
  action: null,
  keys: undefined,
  isTooltipOpen: false,
  setAppointment: (appointment) => set({ appointment }),
  setAction: (action) => set({ action }),
  setKeys: (keys) => set({ keys }),
  resetState: () => set({ appointment: null, action: null, keys: undefined }),
  setIsTooltipOpen: (isTooltipOpen) => set({ isTooltipOpen }),
}));
