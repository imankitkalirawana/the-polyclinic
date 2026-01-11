import ActivityTimeline from '@/components/ui/activity/timeline';
import { useQueueActivityLogs } from '@/services/client/appointment/queue/queue.query';
import React from 'react';

export default function QueueActivityLogs({ queueId }: { queueId: string }) {
  const { data, isLoading } = useQueueActivityLogs(queueId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>No data found</div>;
  }
  return <ActivityTimeline activities={data} />;
}
