import { useQuery } from '@tanstack/react-query';

import { AppointmentApi } from '@/services/client/appointment/api';
import { useGenericMutation } from '../../useGenericMutation';

import { CreateAppointmentType } from './types';

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

export const useAppointmentWithAID = (aid?: string | null) =>
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
  return useGenericMutation({
    mutationFn: async (appointment: CreateAppointmentType) => {
      const result = await AppointmentApi.create(appointment);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    successMessage: 'Appointment created',
    invalidateQueries: [['appointments']],
  });
};

export const useConfirmAppointment = () => {
  return useGenericMutation({
    mutationFn: async ({ aid }: { aid: string }) => {
      const result = await AppointmentApi.confirm(aid);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    successMessage: 'Appointment confirmed',
    errorMessage: 'Error confirming appointment',
    invalidateQueries: [['appointments']],
    invalidateQueriesWithVariables: ({ aid }) => [['appointment', aid]],
  });
};

export const useCancelAppointment = () => {
  return useGenericMutation({
    mutationFn: async ({ aid, remarks }: { aid: string; remarks: string }) => {
      const result = await AppointmentApi.cancel(aid, remarks);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    successMessage: 'Appointment cancelled',
    errorMessage: 'Error cancelling appointment',
    invalidateQueries: [['appointments']],
    invalidateQueriesWithVariables: ({ aid }) => [['appointment', aid]],
  });
};

export const useRescheduleAppointment = () => {
  return useGenericMutation({
    mutationFn: async ({ aid, date }: { aid: string; date: string }) => {
      const result = await AppointmentApi.reschedule(aid, date);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    successMessage: 'Appointment rescheduled',
    errorMessage: 'Error rescheduling appointment',
    invalidateQueries: [['appointments']],
    invalidateQueriesWithVariables: ({ aid }) => [['appointment', aid]],
  });
};

export const useSendReminder = () => {
  return useGenericMutation({
    mutationFn: async ({ aid }: { aid: string }) => {
      const result = await AppointmentApi.sendReminder(aid);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    successMessage: 'Reminder sent',
    errorMessage: 'Error sending reminder',
  });
};
