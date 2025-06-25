import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAllServices, getServiceWithUID } from './api/service';
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

export const useServiceWithUID = (uid: string): UseQueryResult<ServiceType> => {
  return useQuery({
    queryKey: ['service', uid],
    queryFn: async () => {
      const res = await getServiceWithUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};
