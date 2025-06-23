import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAllDrugs } from './api/drug';
import { DrugType } from '@/types/drug';

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
