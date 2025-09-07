import { addToast } from '@heroui/react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { getAllDrugs, getDrugWithDid, updateDrug } from './api';
import { ApiResponse } from '@/services/fetch';

import { DrugType } from '@/services/client/drug/types';

export const useAllDrugs = (): UseQueryResult<DrugType[]> =>
  useQuery({
    queryKey: ['drugs'],
    queryFn: async () => {
      const res = await getAllDrugs();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useDrugWithDid = (did: number): UseQueryResult<DrugType> =>
  useQuery({
    queryKey: ['drug', did],
    queryFn: async () => {
      const res = await getDrugWithDid(did);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!did,
  });

// Update
export const useUpdateDrug = (): UseMutationResult<ApiResponse<DrugType>, Error, DrugType> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DrugType) => {
      const res = await updateDrug(data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['drug', data.data.did] });
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
