import {
  useCallPatient,
  useClockInPatient,
  useSkipPatient,
  useCompletePatient,
} from '@/services/client/appointment/queue/query';
import { AppointmentQueueType, QueueStatus } from '@/services/client/appointment/queue/types';
import { Button } from '@heroui/react';
import { useQueryState } from 'nuqs';
import { useFormContext } from 'react-hook-form';
import { type PrescriptionFormSchema } from '../priscription-panel';

export default function QueueFooterActions({
  currentQueue,
}: {
  currentQueue: AppointmentQueueType;
}) {
  const [_sequenceNumber, setSequenceNumber] = useQueryState('sequenceNumber');
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

  return (
    <div className="flex items-center gap-2">
      {isSkipButton && (
        <Button
          isLoading={isSkipPending}
          variant={currentQueue.status === QueueStatus.IN_CONSULTATION ? 'light' : 'flat'}
          onPress={() =>
            mutateSkip({
              queueId: currentQueue.id,
              _doctorId: currentQueue.doctor.id,
              _sequenceNumber: _sequenceNumber ?? '0',
            }).then(() => {
              setSequenceNumber((currentQueue.sequenceNumber + 1).toString());
            })
          }
        >
          Skip
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
              _doctorId: currentQueue.doctor.id,
              _sequenceNumber: _sequenceNumber ?? '0',
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
              _doctorId: currentQueue.doctor.id,
              _sequenceNumber: _sequenceNumber ?? '0',
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
              _doctorId: currentQueue.doctor.id,
              _sequenceNumber: _sequenceNumber ?? '0',
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
          onPress={() => setSequenceNumber((currentQueue.sequenceNumber + 1).toString())}
        >
          Next Appointment
        </Button>
      )}
    </div>
  );
}
