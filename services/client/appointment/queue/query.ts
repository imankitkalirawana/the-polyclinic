import { useQuery } from '@tanstack/react-query';
import { AppointmentQueueApi } from './api';
import { useGenericMutation } from '@/services/useGenericMutation';
import { PrescriptionFormSchema } from '@/components/client/appointments/queue/priscription-panel';

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

export const useQueueForDoctor = (doctorId: string, sequenceNumber?: string) => {
  return useQuery({
    queryKey: ['queue-for-doctor', doctorId, sequenceNumber],
    queryFn: async () => {
      const result = await AppointmentQueueApi.getQueueForDoctor(doctorId, sequenceNumber);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });
};

export const useCallPatient = () => {
  return useGenericMutation({
    mutationFn: async ({
      queueId,
      _doctorId,
      _sequenceNumber,
    }: {
      queueId: string;
      _doctorId: string;
      _sequenceNumber: string;
    }) => {
      const res = await AppointmentQueueApi.call(queueId);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables(variables) {
      return [['queue-for-doctor', variables._doctorId, variables._sequenceNumber.toString()]];
    },
  });
};

export const useSkipPatient = () => {
  return useGenericMutation({
    mutationFn: async ({
      queueId,
      _doctorId,
      _sequenceNumber,
    }: {
      queueId: string;
      _doctorId: string;
      _sequenceNumber: string;
    }) => {
      const res = await AppointmentQueueApi.skip(queueId);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables(variables) {
      return [['queue-for-doctor', variables._doctorId, variables._sequenceNumber.toString()]];
    },
  });
};

export const useClockInPatient = () => {
  return useGenericMutation({
    mutationFn: async ({
      queueId,
      _doctorId,
      _sequenceNumber,
    }: {
      queueId: string;
      _doctorId: string;
      _sequenceNumber: string;
    }) => {
      const res = await AppointmentQueueApi.clockIn(queueId);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables(variables) {
      return [['queue-for-doctor', variables._doctorId, variables._sequenceNumber.toString()]];
    },
  });
};

export const useCompletePatient = () => {
  return useGenericMutation({
    mutationFn: async ({
      queueId,
      data,
      _doctorId,
      _sequenceNumber,
    }: {
      queueId: string;
      data: PrescriptionFormSchema;
      _doctorId: string;
      _sequenceNumber: string;
    }) => {
      const res = await AppointmentQueueApi.complete(queueId, data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    invalidateQueriesWithVariables(variables) {
      return [['queue-for-doctor', variables._doctorId, variables._sequenceNumber.toString()]];
    },
  });
};
