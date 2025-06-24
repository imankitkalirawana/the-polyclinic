import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAllServices } from './api/service';
import { ServiceType } from '@/types/service';

export const useAllServices = (): UseQueryResult<ServiceType[]> => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await getAllServices();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};
