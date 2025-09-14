import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { ApiResponse } from '@/services/fetch';
import { AppointmentApi } from '@/services/client/appointment/api';

import { AppointmentType, CreateAppointmentType } from './types';
import { addToast } from '@heroui/react';

export const useAllAppointments = (): UseQueryResult<AppointmentType[]> =>
  useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await AppointmentApi.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialData: [],
  });

export const useAppointmentWithAID = (aid: string): UseQueryResult<AppointmentType> =>
  useQuery({
    queryKey: ['appointment', aid],
    queryFn: async () => {
      const res = await AppointmentApi.getById(aid);
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
      const res = await AppointmentApi.create(appointment);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      addToast({
        title: 'Appointment created',
        description: 'Your appointment has been successfully scheduled.',
        color: 'success',
      });
    },
  });
};
