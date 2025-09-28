import { Selection } from '@heroui/react';
import { create } from 'zustand';

import { ActionType } from '@/services/client/appointment';

interface AppointmentStoreState {
  aid: string | null;
  action: ActionType | null;
  keys: Selection | undefined;
  setAid: (aid: string | null) => void;
  setAction: (action: ActionType | null) => void;
  setKeys: (keys: Selection) => void;
  resetState: () => void;
  isTooltipOpen: boolean;
  setIsTooltipOpen: (isTooltipOpen: boolean) => void;
}

// Zustand store for appointment state
export const useAppointmentStore = create<AppointmentStoreState>((set) => ({
  aid: null,
  action: null,
  keys: undefined,
  isTooltipOpen: false,
  setAid: (aid) => set({ aid }),
  setAction: (action) => set({ action }),
  setKeys: (keys) => set({ keys }),
  resetState: () => set({ aid: null, action: null, keys: undefined }),
  setIsTooltipOpen: (isTooltipOpen) => set({ isTooltipOpen }),
}));
