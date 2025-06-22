import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAllAppointments } from './api/appointment';
import { AppointmentType } from '@/types/appointment';

export const useAllAppointments = (): UseQueryResult<AppointmentType[]> => {
  return useQuery({
    queryKey: ['all-appointments'],
    queryFn: () => getAllAppointments(),
  });
};
