import { useQuery } from '@tanstack/react-query';
import { AppointmentQueueApi } from './api';
import { useGenericMutation } from '@/services/useGenericMutation';

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
