import { useQuery, UseQueryResult, useInfiniteQuery } from '@tanstack/react-query';

import {
  getAllPatients,
  getPatientsWithPagination,
  getPreviousAppointments,
  PatientsResponse,
} from './api/patient';
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
  return useInfiniteQuery({
    queryKey: ['patients-infinite', search],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getPatientsWithPagination({
        page: pageParam,
        limit: 20,
        search,
      });
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PatientsResponse) => {
      return lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
