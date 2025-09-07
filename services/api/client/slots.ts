'use server';

import { fetchData } from '../../fetch';

import { SlotConfig } from '@/types/client/slots';

export const updateSlots = async (uid: string, slot: SlotConfig) =>
  await fetchData<SlotConfig>(`/doctors/${uid}/slots`, {
    method: 'POST',
    data: slot,
  });
