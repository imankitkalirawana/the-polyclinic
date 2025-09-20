import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Doctor, DoctorSlots } from './api';

import { SlotConfig } from './types';
import { addToast } from '@heroui/react';

export const useAllDoctors = () =>
  useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await Doctor.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useDoctorByUID = (uid?: string | null) =>
  useQuery({
    queryKey: ['doctor', uid],
    queryFn: async () => {
      const res = await Doctor.getByUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });

// Slots

export const useSlotsByUID = (uid: string) =>
  useQuery({
    queryKey: ['slots', uid],
    queryFn: async () => {
      const res = await DoctorSlots.getSlotsByUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });

export const useUpdateSlots = (uid: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: SlotConfig) => {
      const res = await DoctorSlots.updateSlotsByUID(uid, slot);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
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
