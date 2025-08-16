import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getAllPatients, getPreviousAppointments } from './api/patient';
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
