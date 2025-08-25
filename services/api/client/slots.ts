'use server';

import { fetchData } from '..';

import { SlotConfig } from '@/types/slots';

export const getSlotsByUID = async (uid: number) =>
  await fetchData<SlotConfig>(`/doctors/${uid}/slots`);

export const updateSlots = async (uid: number, slot: SlotConfig) =>
  await fetchData<SlotConfig>(`/doctors/${uid}/slots`, {
    method: 'POST',
    data: slot,
  });
