import { useQuery } from '@tanstack/react-query';
import { AppointmentQueueApi } from './api';
import { useGenericMutation } from '@/services/useGenericMutation';
import { PrescriptionFormSchema } from '@/components/client/appointments/queue/priscription-panel';
import { useQueryState } from 'nuqs';
import { AppointmentQueueRequest } from './types';
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
      const queriesToInvalidate = [
        ['queue-for-doctor', data?.doctor?.id, variables?.queueId],
        ['queue-for-doctor', data?.doctor?.id, null],
      ];
      console.log('data', data);
      console.log(queriesToInvalidate);
      return queriesToInvalidate;
    },
    onSuccess: () => {
      const audio = new Audio('/assets/audio/desk-bell.mp3');
      audio.play();
    },
  });
};

export const useSkipPatient = () => {
  return useGenericMutation({
    mutationFn: async ({
      queueId,
      _doctorId,
      _queueId,
    }: {
      queueId: string;
      _doctorId: string;
      _queueId: string;
    }) => {
      const res = await AppointmentQueueApi.skip(queueId);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables({ variables }) {
      return [['queue-for-doctor', variables?._doctorId, variables?._queueId]];
    },
  });
};

export const useClockInPatient = () => {
  return useGenericMutation({
    mutationFn: async ({
      queueId,
      _doctorId,
      _queueId,
    }: {
      queueId: string;
      _doctorId: string;
      _queueId: string;
    }) => {
      const res = await AppointmentQueueApi.clockIn(queueId);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables({ variables }) {
      return [['queue-for-doctor', variables?._doctorId, variables?._queueId]];
    },
  });
};

export const useCompletePatient = () => {
  const [_queueId] = useQueryState('id');
  return useGenericMutation({
    mutationFn: async ({
      queueId,
      data,
      _doctorId,
      _queueId,
    }: {
      queueId: string;
      data: PrescriptionFormSchema;
      _doctorId: string;
      _queueId: string;
    }) => {
      const res = await AppointmentQueueApi.complete(queueId, data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables({ variables }) {
      return [['queue-for-doctor', variables?._doctorId, null]];
    },
  });
};
