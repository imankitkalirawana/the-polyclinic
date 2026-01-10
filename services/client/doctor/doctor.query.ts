import { Doctor, DoctorSlots } from './doctor.api';
import { useGenericQuery } from '@/services/useGenericQuery';
import { useGenericMutation } from '@/services/useGenericMutation';

import { SlotConfig } from './doctor.types';

export const useAllDoctors = (search?: string) =>
  useGenericQuery({
    queryKey: ['doctors', search],
    queryFn: () => Doctor.getAll(search),
  });

export const useDoctorById = (id?: string | null) =>
  useGenericQuery({
    queryKey: ['doctor', id],
    queryFn: () => Doctor.getById(id),
    enabled: !!id,
  });

// Slots

export const useSlotsByUID = (uid: string) =>
  useGenericQuery({
    queryKey: ['slots', uid],
    queryFn: () => DoctorSlots.getSlotsByUID(uid),
    enabled: !!uid,
  });

export const useUpdateSlots = (uid: string) => {
  return useGenericMutation({
    mutationFn: (slot: SlotConfig) => DoctorSlots.updateSlotsByUID(uid, slot),
    invalidateQueries: [['slots', uid]],
  });
};
