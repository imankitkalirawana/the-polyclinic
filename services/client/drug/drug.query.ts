import { useGenericQuery } from '@/services/useGenericQuery';
import { useGenericMutation } from '@/services/useGenericMutation';
import { DrugType } from '@/services/client/drug/drug.types';
import { DrugApi } from './drug.api';

export const useAllDrugs = () =>
  useGenericQuery({
    queryKey: ['drugs'],
    queryFn: () => DrugApi.getAll(),
  });

export const useDrugWithDid = (did: number) =>
  useGenericQuery({
    queryKey: ['drug', did],
    queryFn: () => DrugApi.getByDid(did),
    enabled: !!did,
  });

// Update
export const useUpdateDrug = () => {
  return useGenericMutation({
    mutationFn: (data: DrugType) => DrugApi.update(data),
    invalidateQueries: [['drug']],
  });
};
