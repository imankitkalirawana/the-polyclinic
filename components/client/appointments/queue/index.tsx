'use client';

import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { useQueueForDoctor } from '@/services/client/appointment/queue/query';
import { QueueStatus } from '@/services/client/appointment/queue/types';
import { ScrollShadow } from '@heroui/react';
import PrescriptionPanel, {
  prescriptionFormSchema,
  type PrescriptionFormSchema,
} from './priscription-panel';
import Medicines from './medicines';
import PreviousQueues from './previous-queues';
import QueuesList from './queues-list';
import { useQueryState } from 'nuqs';
import DetailsHeader from './details-header';
import QueueFooter from './footer';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DataItem from '@/components/ui/data-item';

export default function Queues() {
  const [queueId, setQueueId] = useQueryState('id');

  const { data, isLoading } = useQueueForDoctor(
    '50c99b05-f917-48ea-9f4c-d3b2701e41a2',
    queueId ?? null
  );

  // Initialize prescription form with FormProvider
  const prescriptionForm = useForm<PrescriptionFormSchema>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      title: '',
      prescription: '',
    },
    mode: 'onChange',
  });

  if (!data && !isLoading) {
    return <MinimalPlaceholder message="No queues found" isLoading={false} />;
  }

  const currentQueue = data?.current;
  const nextQueues = data?.next;
  const previousQueues = data?.previous;

  return (
    <FormProvider {...prescriptionForm}>
      <div
        className="flex h-[calc(100vh-58px)] divide-x-1 divide-divider"
        data-test-id="appointment-queues"
      >
        <div className="flex w-3/4 flex-col justify-start" data-test-id="current-queue">
          {currentQueue ? (
            <>
              <DetailsHeader currentQueue={currentQueue} />
              {currentQueue.status === QueueStatus.IN_CONSULTATION && (
                <ScrollShadow className="h-full">
                  <PrescriptionPanel />
                  <Medicines />
                </ScrollShadow>
              )}

              {currentQueue.status === QueueStatus.COMPLETED && (
                <div className="flex flex-col gap-4 p-4">
                  <DataItem label="Title" value={currentQueue.title} />
                  <div className="flex flex-col">
                    <span className="text-default-500 text-tiny">Prescription</span>
                    <div
                      className="ProseMirror text-small"
                      dangerouslySetInnerHTML={{ __html: currentQueue.prescription }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <MinimalPlaceholder message="Nothing to show here" isLoading={false} />
          )}

          <QueueFooter currentQueue={currentQueue} />
        </div>

        {/* next queues */}
        <QueuesList queues={nextQueues ?? []} onSelect={(queueId) => setQueueId(queueId)} />
        <PreviousQueues previousQueues={previousQueues ?? []} />
      </div>
    </FormProvider>
  );
}
