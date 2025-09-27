import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AppointmentApi } from '@/services/client/appointment/api';

import { CreateAppointmentType } from './types';
import { addToast } from '@heroui/react';

export const useAllAppointments = () =>
  useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const result = await AppointmentApi.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    initialData: [],
  });

export const useAppointmentWithAID = (aid: string) =>
  useQuery({
    queryKey: ['appointment', aid],
    queryFn: async () => {
      const result = await AppointmentApi.getById(aid);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!aid,
  });

// POST

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointment: CreateAppointmentType) => {
      const result = await AppointmentApi.create(appointment);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
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
