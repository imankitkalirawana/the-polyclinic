import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { ApiResponse } from '@/services/api';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentWithAID,
} from '@/services/api/client/appointment';

import { AppointmentType } from '@/types/client/appointment';
import { CreateAppointmentType } from '@/components/client/appointments/create/types';

export const useAllAppointments = (): UseQueryResult<AppointmentType[]> =>
  useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await getAllAppointments();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useAppointmentWithAID = (aid: string): UseQueryResult<AppointmentType> =>
  useQuery({
    queryKey: ['appointment', aid],
    queryFn: async () => {
      const res = await getAppointmentWithAID(aid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!aid,
  });

// POST

export const useCreateAppointment = (): UseMutationResult<
  ApiResponse<AppointmentType>,
  Error,
  CreateAppointmentType
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointment: CreateAppointmentType) => {
      const res = await createAppointment(appointment);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
