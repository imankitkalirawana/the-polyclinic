import { useQuery } from '@tanstack/react-query';
import { AppointmentQueueApi } from './queue.api';
import { useGenericMutation } from '@/services/useGenericMutation';
import { PrescriptionFormSchema } from '@/components/client/appointments/queue/views/doctor/prescription-panel';
import { AppointmentQueueRequest } from './queue.types';
import { saveAs } from 'file-saver';

export const useAllAppointmentQueues = () => {
  return useQuery({
    queryKey: ['appointment-queues'],
    queryFn: async () => {
      const result = await AppointmentQueueApi.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });
};

export const useAppointmentQueueById = (appointmentId?: string | null) => {
  return useQuery({
    queryKey: ['appointment-queue', appointmentId],
    queryFn: async () => {
      const result = await AppointmentQueueApi.getById(appointmentId);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!appointmentId,
  });
};

export const useQueueForDoctor = (doctorId: string, queueId?: string | null) => {
  return useQuery({
    queryKey: ['queue-for-doctor', doctorId, queueId],
    queryFn: async () => {
      const result = await AppointmentQueueApi.getQueueForDoctor(doctorId, queueId);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });
};

export const useQueueActivityLogs = (queueId?: string | null) => {
  return useQuery({
    queryKey: ['queue-activity-logs', queueId],
    queryFn: async () => {
      const result = await AppointmentQueueApi.getActivityLogs(queueId);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!queueId,
  });
};

// download receipt
export const useDownloadReceipt = () => {
  return useGenericMutation({
    mutationFn: async (appointmentId: string) => {
      const result = await AppointmentQueueApi.downloadReceipt(appointmentId);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
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
    mutationFn: async (data: AppointmentQueueRequest) => {
      const res = await AppointmentQueueApi.create(data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
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
    mutationFn: async ({ queueId }: { queueId: string }) => {
      const res = await AppointmentQueueApi.call(queueId);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables({ variables, data }) {
      const keys = invalidateQueueForDoctor(data?.doctor?.id, variables?.queueId);
      return keys;
    },
    onSuccess: () => {
      const audio = new Audio('/assets/audio/desk-bell.mp3');
      audio.play();
    },
  });
};

export const useSkipPatient = () => {
  return useGenericMutation({
    mutationFn: async ({ queueId }: { queueId: string }) => {
      const res = await AppointmentQueueApi.skip(queueId);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables({ variables, data }) {
      const keys = invalidateQueueForDoctor(data?.doctor?.id, variables?.queueId);
      return keys;
    },
  });
};

export const useClockInPatient = () => {
  return useGenericMutation({
    mutationFn: async ({ queueId }: { queueId: string }) => {
      const res = await AppointmentQueueApi.clockIn(queueId);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables({ variables, data }) {
      const keys = invalidateQueueForDoctor(data?.doctor?.id, variables?.queueId);
      console.log('invalid', keys);
      return keys;
    },
  });
};

export const useCompletePatient = () => {
  return useGenericMutation({
    mutationFn: async ({ queueId, data }: { queueId: string; data: PrescriptionFormSchema }) => {
      const res = await AppointmentQueueApi.complete(queueId, data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables({ variables, data }) {
      return invalidateQueueForDoctor(data?.doctor?.id, variables?.queueId);
    },
  });
};
