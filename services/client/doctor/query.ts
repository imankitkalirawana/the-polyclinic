import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Doctor, DoctorSlots } from './api';

import { SlotConfig } from './types';
import { addToast } from '@heroui/react';

export const useAllDoctors = () =>
  useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const result = await Doctor.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

export const useDoctorByUID = (uid?: string | null) =>
  useQuery({
    queryKey: ['doctor', uid],
    queryFn: async () => {
      const result = await Doctor.getByUID(uid);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!uid,
  });

// Slots

export const useSlotsByUID = (uid: string) =>
  useQuery({
    queryKey: ['slots', uid],
    queryFn: async () => {
      const result = await DoctorSlots.getSlotsByUID(uid);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!uid,
  });

export const useUpdateSlots = (uid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: SlotConfig) => {
      const result = await DoctorSlots.updateSlotsByUID(uid, slot);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['slots', uid] });
      addToast({
        title: data.message,
        color: 'success',
      });
    },
    onError: (error: Error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};
