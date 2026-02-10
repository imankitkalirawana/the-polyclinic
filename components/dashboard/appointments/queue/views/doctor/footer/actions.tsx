import {
  useCallPatient,
  useClockInPatient,
  useSkipPatient,
  useCompletePatient,
} from '@/services/client/appointment/queue/queue.query';
import { AppointmentQueueType, QueueStatus } from '@/services/client/appointment/queue/queue.types';
import { Button } from '@heroui/react';
import { useQueryState } from 'nuqs';
import { useFormContext } from 'react-hook-form';
import { type PrescriptionFormSchema } from '../prescription-panel';

export default function QueueFooterActions({
  currentQueue,
}: {
  currentQueue: AppointmentQueueType;
}) {
  const [_queueId, setQueueId] = useQueryState('id');
  const { mutateAsync: mutateCall, isPending: isCallPending } = useCallPatient();
  const { mutateAsync: mutateClockIn, isPending: isClockInPending } = useClockInPatient();
  const { mutateAsync: mutateSkip, isPending: isSkipPending } = useSkipPatient();
  const { mutateAsync: mutateComplete, isPending: isCompletePending } = useCompletePatient();

  // Access form context - FormProvider is always available from parent
  // Only use form when status is IN_CONSULTATION
  const form = useFormContext<PrescriptionFormSchema>();

  const isSkipButton = [
    QueueStatus.BOOKED,
    QueueStatus.CALLED,
    QueueStatus.SKIPPED,
    QueueStatus.IN_CONSULTATION,
  ].includes(currentQueue.status);
  const isCallButton = currentQueue.status === QueueStatus.BOOKED;
  const isClockInButton = currentQueue.status === QueueStatus.CALLED;
  const isCompleteButton = currentQueue.status === QueueStatus.IN_CONSULTATION;
  const isNextButton = [QueueStatus.COMPLETED, QueueStatus.CANCELLED].includes(currentQueue.status);
  const isRecallButton = [QueueStatus.SKIPPED, QueueStatus.CALLED].includes(currentQueue.status);
  const isEditButton = currentQueue.status === QueueStatus.COMPLETED;

  return (
    <div className="flex items-center gap-2">
      {isSkipButton && (
        <Button
          isLoading={isSkipPending}
          variant={currentQueue.status === QueueStatus.IN_CONSULTATION ? 'light' : 'flat'}
          onPress={() =>
            mutateSkip({
              queueId: currentQueue.id,
            }).then(() => {
              setQueueId(currentQueue.nextQueueId ?? null);
            })
          }
        >
          Skip
        </Button>
      )}
      {isEditButton && (
        <Button variant="flat" onPress={() => console.log('edit')}>
          Edit
        </Button>
      )}
      {(isCallButton || isRecallButton) && (
        <Button
          isLoading={isCallPending}
          variant={isRecallButton ? 'flat' : 'shadow'}
          color="primary"
          onPress={() =>
            mutateCall({
              queueId: currentQueue.id,
            })
          }
        >
          {isRecallButton ? 'Recall' : 'Call'}
        </Button>
      )}
      {isClockInButton && (
        <Button
          isLoading={isClockInPending}
          variant="shadow"
          color="primary"
          onPress={() =>
            mutateClockIn({
              queueId: currentQueue.id,
            })
          }
        >
          Clock In
        </Button>
      )}
      {isCompleteButton && (
        <Button
          variant="shadow"
          color="primary"
          isLoading={isCompletePending}
          onPress={async () => {
            const isValid = await form.trigger();
            if (!isValid) {
              return;
            }

            const data = form.getValues();

            await mutateComplete({
              queueId: currentQueue.id,
              data,
            });

            form.reset();
          }}
        >
          Complete
        </Button>
      )}
      {isNextButton && (
        <Button
          variant="shadow"
          color="primary"
          onPress={() => {
            if (currentQueue.nextQueueId) {
              setQueueId(currentQueue.nextQueueId);
            }
          }}
        >
          Next Appointment
        </Button>
      )}
    </div>
  );
}
