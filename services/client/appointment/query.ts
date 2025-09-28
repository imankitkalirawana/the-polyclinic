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

export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ aid }: { aid: string }) => {
      const result = await AppointmentApi.confirm(aid);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.aid] });
      addToast({
        title: data.message,
        description: 'Your appointment has been successfully confirmed.',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: 'Error confirming appointment',
        description: error.message,
        color: 'danger',
      });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ aid }: { aid: string }) => {
      const result = await AppointmentApi.cancel(aid);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.aid] });
      addToast({
        title: data.message,
        description: 'Your appointment has been successfully cancelled.',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: 'Error cancelling appointment',
        description: error.message,
        color: 'danger',
      });
    },
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ aid, date }: { aid: string; date: string }) => {
      const result = await AppointmentApi.reschedule(aid, date);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.aid] });
      addToast({
        title: data.message,
        description: 'Your appointment has been successfully rescheduled.',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: 'Error rescheduling appointment',
        description: error.message,
        color: 'danger',
      });
    },
  });
};

export const useSendReminder = () => {
  return useMutation({
    mutationFn: async ({ aid }: { aid: string }) => {
      const result = await AppointmentApi.sendReminder(aid);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data) => {
      addToast({
        title: 'Reminder Sent',
        description: data.message || 'Reminder sent to the patient successfully.',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: 'Error sending reminder',
        description: error.message,
        color: 'danger',
      });
    },
  });
};
