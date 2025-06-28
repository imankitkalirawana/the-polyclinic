import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getAllDrugs, getDrugWithDid, updateDrug } from './api/drug';
import { DrugType } from '@/types/drug';
import { ApiResponse } from './api';
import { addToast } from '@heroui/react';

export const useAllDrugs = (): UseQueryResult<DrugType[]> => {
  return useQuery({
    queryKey: ['drugs'],
    queryFn: async () => {
      const res = await getAllDrugs();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

export const useDrugWithDid = (did: number): UseQueryResult<DrugType> => {
  return useQuery({
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
};

// Update
export const useUpdateDrug = (): UseMutationResult<
  ApiResponse<DrugType>,
  Error,
  { did: number; drug: DrugType }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ did, drug }: { did: number; drug: DrugType }) => {
      const res = await updateDrug(did, drug);
      if (res.success) {
        return {
          success: true,
          message: res.message,
          data: res.data,
        };
      }
      throw new Error(res.message);
    },
    onSuccess: (data) => {
      addToast({
        title: data.message,
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['drug', data.data.did] });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};
