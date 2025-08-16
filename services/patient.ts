import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getAllPatients, getPatientsWithPagination, getPreviousAppointments } from './api/patient';
import { useInfiniteQueryWithSearch } from './infinite-query';
import { UserType } from '@/types/user';
import { AppointmentType } from '@/types/appointment';

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

export const usePatientsInfiniteQuery = (search: string = '') => {
  return useInfiniteQueryWithSearch({
    queryKey: ['patients-infinite'],
    queryFn: getPatientsWithPagination,
    search: search.trim(),
    options: {
      limit: 5,
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: true,
    },
  });
};

export const usePreviousAppointments = (uid: number): UseQueryResult<AppointmentType[]> =>
  useQuery({
    queryKey: ['previous-appointments', uid],
    queryFn: async () => {
      const res = await getPreviousAppointments(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });
