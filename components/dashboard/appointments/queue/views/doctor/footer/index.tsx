import { AppointmentQueue } from '@repo/store';
import { Button, cn } from '@heroui/react';
import { useQueryState } from 'nuqs';
import QueueFooterActions from './actions';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function QueueFooter({ currentQueue }: { currentQueue?: AppointmentQueue | null }) {
  const [queueId, setQueueId] = useQueryState('id');
  const [showNextQueues] = useLocalStorage('show-next-queues', true);

  const handleGoToCurrent = () => {
    setQueueId(null);
  };

  return (
    <div
      data-testid="queue-footer"
      className={cn(
        'border-divider bg-background/60 absolute bottom-0 left-0 z-10 flex w-full justify-between gap-2 border-t p-2 px-4 backdrop-blur-sm',
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
