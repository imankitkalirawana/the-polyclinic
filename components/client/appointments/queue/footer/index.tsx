import { AppointmentQueueType } from '@/services/client/appointment/queue/types';
import { Button } from '@heroui/react';
import { useQueryState } from 'nuqs';
import QueueFooterActions from './actions';

export default function QueueFooter({
  currentQueue,
}: {
  currentQueue?: AppointmentQueueType | null;
}) {
  const [queueId, setQueueId] = useQueryState('id');

  const handleGoToCurrent = () => {
    setQueueId(null);
  };

  return (
    <div className="fixed bottom-0 left-0 z-10 flex w-3/4 justify-between gap-2 border-t border-divider bg-background p-2 px-4">
      <Button
        variant={queueId ? 'flat' : 'solid'}
        color={queueId ? 'primary' : 'default'}
        isDisabled={!queueId}
        onPress={handleGoToCurrent}
      >
        Go to Current
      </Button>

      {currentQueue && <QueueFooterActions currentQueue={currentQueue} />}
    </div>
  );
}
