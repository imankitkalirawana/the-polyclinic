import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { Doctor, DoctorSlots } from './api';

import { DoctorType } from './types';
import { SlotConfig } from '@/types/client/slots';
import { ApiResponse } from '@/services/fetch';
import { addToast } from '@heroui/react';

export const useAllDoctors = (): UseQueryResult<DoctorType[]> =>
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

export const useDoctorByUID = (uid?: string | null): UseQueryResult<DoctorType | null> =>
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

export const useSlotsByUID = (uid: string): UseQueryResult<SlotConfig | null> =>
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

export const useUpdateSlots = (
  uid: string
): UseMutationResult<ApiResponse<SlotConfig>, Error, SlotConfig> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: SlotConfig) => {
      const res = await DoctorSlots.updateSlotsByUID(uid, slot);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data: ApiResponse<SlotConfig>) => {
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
