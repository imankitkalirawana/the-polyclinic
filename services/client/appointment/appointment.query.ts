import { AppointmentApi } from '@/services/client/appointment/appointment.api';
import { useGenericMutation } from '../../useGenericMutation';
import { useGenericQuery } from '../../useGenericQuery';

import { CreateAppointmentType } from './appointment.types';

export const useAllAppointments = () =>
  useGenericQuery({
    queryKey: ['appointments'],
    queryFn: () => AppointmentApi.getAll(),
    initialData: [],
  });

export const useAppointmentWithAID = (aid?: string | null) =>
  useGenericQuery({
    queryKey: ['appointment', aid],
    queryFn: () => AppointmentApi.getById(aid),
    enabled: !!aid,
  });

// POST

export const useCreateAppointment = () => {
  return useGenericMutation({
    mutationFn: (appointment: CreateAppointmentType) => AppointmentApi.create(appointment),
    invalidateQueries: [['appointments']],
  });
};

export const useConfirmAppointment = () => {
  return useGenericMutation({
    mutationFn: (aid: string) => AppointmentApi.confirm(aid),
    invalidateQueries: [['appointments']],
    invalidateQueriesWithVariables: ({ variables }) => [['appointment', variables]],
  });
};

export const useCancelAppointment = () => {
  return useGenericMutation({
    mutationFn: ({ aid, remarks }: { aid: string; remarks: string }) =>
      AppointmentApi.cancel(aid, remarks),
    invalidateQueries: [['appointments']],
    invalidateQueriesWithVariables: ({ variables }) => [['appointment', variables?.aid]],
  });
};

export const useChangeDoctorAppointment = () => {
  return useGenericMutation({
    mutationFn: ({ aid, doctorId }: { aid: string; doctorId: string }) =>
      AppointmentApi.changeDoctor(aid, doctorId),
    invalidateQueries: [['appointments']],
    invalidateQueriesWithVariables: ({ variables }) => [['appointment', variables?.aid]],
  });
};

export const useRescheduleAppointment = () => {
  return useGenericMutation({
    mutationFn: ({ aid, date }: { aid: string; date: string }) =>
      AppointmentApi.reschedule(aid, date),
    invalidateQueries: [['appointments']],
    invalidateQueriesWithVariables: ({ variables }) => [['appointment', variables?.aid]],
  });
};

export const useSendReminder = () => {
  return useGenericMutation({
    mutationFn: ({ aid, emails }: { aid: string; emails: string | string[] }) =>
      AppointmentApi.sendReminder(aid, emails),
  });
};
