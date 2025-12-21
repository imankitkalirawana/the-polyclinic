import { useQuery } from '@tanstack/react-query';
import { AppointmentQueueApi } from './api';

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

export const useQueueForDoctor = (doctorId: string, sequenceNumber?: number) => {
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
