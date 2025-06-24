import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AppointmentType } from '@/types/appointment';
import { getAllAppointments } from './api/appointment';

export const useAllAppointments = (): UseQueryResult<AppointmentType[]> => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await getAllAppointments();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialData: [],
  });
};
