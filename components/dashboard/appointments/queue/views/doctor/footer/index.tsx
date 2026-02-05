import { AppointmentQueueType } from '@/services/client/appointment/queue/queue.types';
import { Button, cn } from '@heroui/react';
import { useQueryState } from 'nuqs';
import QueueFooterActions from './actions';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function QueueFooter({
  currentQueue,
}: {
  currentQueue?: AppointmentQueueType | null;
}) {
  const [queueId, setQueueId] = useQueryState('id');
  const [showNextQueues] = useLocalStorage('show-next-queues', true);

  const handleGoToCurrent = () => {
    setQueueId(null);
  };

  return (
    <div
      data-testid="queue-footer"
      className={cn(
        'absolute bottom-0 left-0 z-10 flex w-full justify-between gap-2 border-t border-divider bg-background p-2 px-4',
        {
          'max-w-full': !showNextQueues,
        }
      )}
    >
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
