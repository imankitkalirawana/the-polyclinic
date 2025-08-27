'use server';

import { fetchData } from '..';

import { SlotConfig } from '@/types/client/slots';

export const getSlotsByUID = async (uid: string) =>
  await fetchData<SlotConfig>(`/doctors/${uid}/slots`);

export const updateSlots = async (uid: string, slot: SlotConfig) =>
  await fetchData<SlotConfig>(`/doctors/${uid}/slots`, {
    method: 'POST',
    data: slot,
  });
