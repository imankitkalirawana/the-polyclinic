import { QueueStatus } from '@/services/client/appointment/queue/queue.types';

export const getQueueStatusColor = (status: QueueStatus) => {
  return {
    'border-l-success': status === QueueStatus.COMPLETED,
    'border-l-warning': status === QueueStatus.SKIPPED,
    'border-l-danger': status === QueueStatus.CANCELLED,
    'border-l-blue-500': status === QueueStatus.CALLED,
    'border-l-primary': status === QueueStatus.IN_CONSULTATION,
  };
};
