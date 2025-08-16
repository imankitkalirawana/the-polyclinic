import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getAllPatients } from './api/patient';
import { UserType } from '@/types/user';

export const useAllPatients = (): UseQueryResult<UserType[]> =>
  useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await getAllPatients();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
