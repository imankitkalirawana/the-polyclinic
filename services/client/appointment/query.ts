import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AppointmentApi } from '@/services/client/appointment/api';

import { CreateAppointmentType } from './types';
import { addToast } from '@heroui/react';

export const useAllAppointments = () =>
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

export const useAppointmentWithAID = (aid: string) =>
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

export const useCreateAppointment = () => {
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
