import { addToast } from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DrugType } from '@/services/client/drug/drug.types';
import { DrugApi } from './drug.api';

export const useAllDrugs = () =>
  useQuery({
    queryKey: ['drugs'],
    queryFn: async () => {
      const result = await DrugApi.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

export const useDrugWithDid = (did: number) =>
  useQuery({
    queryKey: ['drug', did],
    queryFn: async () => {
      const result = await DrugApi.getByDid(did);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!did,
  });

// Update
export const useUpdateDrug = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DrugType) => {
      const result = await DrugApi.update(data);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['drug', data?.data?.did] });
      addToast({
        title: data.message,
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};
