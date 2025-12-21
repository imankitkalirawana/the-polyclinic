import { AppointmentQueueType } from '@/services/client/appointment/queue/types';
import { ButtonGroup, Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useQueryState } from 'nuqs';
import QueueFooterActions from './actions';

export default function QueueFooter({
  previousQueues,
  currentQueue,
  nextQueues,
}: {
  previousQueues: AppointmentQueueType[];
  currentQueue?: AppointmentQueueType | null;
  nextQueues: AppointmentQueueType[];
}) {
  const [sequenceNumber, setSequenceNumber] = useQueryState('sequenceNumber');

  const handlePrevious = () => {
    if (previousQueues.length > 0) {
      setSequenceNumber(previousQueues[0].sequenceNumber.toString());
    }
  };

  const handleNext = () => {
    if (nextQueues.length > 0) {
      setSequenceNumber(nextQueues[0].sequenceNumber.toString());
    }
  };

  const handleGoToCurrent = () => {
    setSequenceNumber(null);
  };

  return (
    <div className="fixed bottom-0 left-0 z-10 flex w-3/4 justify-between gap-2 border-t border-divider bg-background p-2 px-4">
      <ButtonGroup size="sm" variant="flat">
        <Button
          title="Previous appointment"
          isIconOnly
          isDisabled={previousQueues.length === 0}
          onPress={handlePrevious}
        >
          <Icon icon="solar:alt-arrow-left-line-duotone" width={20} />
        </Button>
        <Button
          variant={sequenceNumber ? 'flat' : 'solid'}
          color={sequenceNumber ? 'primary' : 'default'}
          isDisabled={!sequenceNumber}
          onPress={handleGoToCurrent}
        >
          Go to Current
        </Button>
        <Button
          title="Next appointment"
          isIconOnly
          isDisabled={nextQueues.length === 0}
          onPress={handleNext}
        >
          <Icon icon="solar:alt-arrow-right-line-duotone" width={20} />
        </Button>
      </ButtonGroup>
      {currentQueue && <QueueFooterActions currentQueue={currentQueue} />}
    </div>
  );
}
