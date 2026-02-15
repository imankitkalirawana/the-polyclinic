import { AppointmentQueueApi } from './queue.api';
import { useGenericMutation } from '@/services/useGenericMutation';
import { useGenericQuery } from '@/services/useGenericQuery';
import { PrescriptionFormSchema } from '@/components/dashboard/appointments/queue/views/doctor/prescription-panel';
import { AppointmentQueueRequest } from './queue.types';
import { saveAs } from 'file-saver';

export const useAllAppointmentQueues = () => {
  return useGenericQuery({
    queryKey: ['appointment-queues'],
    queryFn: () => AppointmentQueueApi.getAll(),
  });
};

export const useAppointmentQueueByAid = (aid?: string | null) => {
  return useGenericQuery({
    queryKey: ['appointment-queue-by-aid', aid],
    queryFn: () => AppointmentQueueApi.getByAid(aid),
    enabled: !!aid,
  });
};

export const useQueueForDoctor = (
  doctorId?: string | null,
  queueId?: string | null,
  appointmentDate?: Date | null
) => {
  return useGenericQuery({
    queryKey: ['queue-for-doctor', doctorId, queueId, appointmentDate],
    queryFn: () => AppointmentQueueApi.getQueueForDoctor(doctorId, queueId, appointmentDate),
    enabled: !!doctorId,
  });
};

export const useQueueActivityLogs = (queueId?: string | null) => {
  return useGenericQuery({
    queryKey: ['queue-activity-logs', queueId],
    queryFn: () => AppointmentQueueApi.getActivityLogs(queueId),
    enabled: !!queueId,
  });
};

// download receipt
export const useDownloadReceipt = () => {
  return useGenericMutation({
    mutationFn: (appointmentId: string) => AppointmentQueueApi.downloadReceipt(appointmentId),
    onSuccess: (data) => {
      if (!data.data) {
        return;
      }
      saveAs(data.data, 'receipt.pdf');
    },
  });
};

export const useCreateAppointmentQueue = () => {
  return useGenericMutation({
    mutationFn: (data: AppointmentQueueRequest) => AppointmentQueueApi.create(data),
    invalidateAllQueries: true,
  });
};

const invalidateQueueForDoctor = (doctorId?: string | null, queueId?: string | null) => {
  return [
    ['queue-for-doctor', doctorId, queueId],
    ['queue-for-doctor', doctorId, null],
    ['queue-activity-logs', queueId],
  ];
};

export const useCallPatient = () => {
  return useGenericMutation({
    mutationFn: ({ queueId }: { queueId: string }) => AppointmentQueueApi.call(queueId),
    invalidateQueriesWithVariables({ variables, data }) {
      return invalidateQueueForDoctor(data?.doctor?.id, variables?.queueId);
    },
    onSuccess: () => {
      const audio = new Audio('/assets/audio/desk-bell.mp3');
      audio.play();
    },
  });
};

export const useSkipPatient = () => {
  return useGenericMutation({
    mutationFn: ({ queueId }: { queueId: string }) => AppointmentQueueApi.skip(queueId),
    invalidateQueriesWithVariables({ variables, data }) {
      return invalidateQueueForDoctor(data?.doctor?.id, variables?.queueId);
    },
  });
};

export const useClockInPatient = () => {
  return useGenericMutation({
    mutationFn: ({ queueId }: { queueId: string }) => AppointmentQueueApi.clockIn(queueId),
    invalidateQueriesWithVariables({ variables, data }) {
      return invalidateQueueForDoctor(data?.doctor?.id, variables?.queueId);
    },
  });
};

export const useCompletePatient = () => {
  return useGenericMutation({
    mutationFn: ({ queueId, data }: { queueId: string; data: PrescriptionFormSchema }) =>
      AppointmentQueueApi.complete(queueId, data),
    invalidateQueriesWithVariables({ variables, data }) {
      return invalidateQueueForDoctor(data?.doctor?.id, variables?.queueId);
    },
  });
};
