import { useQueueActivityLogs } from '@/services/client/appointment/queue/queue.query';

export default function QueueActivityLogs({ queueId }: { queueId: string }) {
  const { data, isLoading } = useQueueActivityLogs(queueId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>No data found</div>;
  }
  return <div>{JSON.stringify(data)}</div>;
}
