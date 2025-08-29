import { addToast } from '@heroui/react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { getSlotsByUID, updateSlots } from '../../../services/api/client/slots';
import { ApiResponse } from '../../../services/fetch';

import { SlotConfig } from '@/types/client/slots';

export const useSlotsByUID = (uid: string): UseQueryResult<SlotConfig> =>
  useQuery({
    queryKey: ['slots', uid],
    queryFn: async () => {
      const res = await getSlotsByUID(uid);
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
    mutationFn: async (slot: SlotConfig) => {
      const res = await updateSlots(uid, slot);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
  });
};
