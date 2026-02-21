import { useGenericQuery } from '@/services/useGenericQuery';
import { useGenericMutation } from '@/services/useGenericMutation';
import { DrugApi } from './drug.api';
import { Drug } from '@/shared';

export const useAllDrugs = () =>
  useGenericQuery({
    queryKey: ['drugs'],
    queryFn: () => DrugApi.getAll(),
  });

export const useDrugWithDid = (did: string) =>
  useGenericQuery({
    queryKey: ['drug', did],
    queryFn: () => DrugApi.getByUID(did),
    enabled: !!did,
  });

// Update
export const useUpdateDrug = () => {
  return useGenericMutation({
    mutationFn: (data: Drug) => DrugApi.update(data),
    invalidateQueries: [['drug']],
  });
};
