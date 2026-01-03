'use client';

import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { useQueueForDoctor } from '@/services/client/appointment/queue/queue.query';
import { QueueStatus } from '@/services/client/appointment/queue/queue.types';
import { Button, Chip, ScrollShadow, Tab, Tabs, Tooltip } from '@heroui/react';
import PrescriptionPanel, {
  prescriptionFormSchema,
  type PrescriptionFormSchema,
} from './prescription-panel';
import Medicines from './medicines';
import QueuesList from './queues-list';
import { useQueryState } from 'nuqs';
import DetailsHeader from './details-header';
import QueueFooter from './footer';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useMemo } from 'react';
import CompletedAppointmentQueue from './completed';

export default function QueuesDoctorView() {
  const [queueId, setQueueId] = useQueryState('id');
  const [showNextQueues, setShowNextQueues] = useLocalStorage('show-next-queues', true);
  const [selectedFilters, setSelectedFilters] = useState({
    booked: false,
    skipped: false,
    completed: false,
    cancelled: false,
  });

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

  const currentQueue = data?.current;
  const nextQueues = data?.next;
  const previousQueues = data?.previous;

  const filteredNextQueues = useMemo(() => {
    const queues = nextQueues ?? [];
    const { booked, skipped } = selectedFilters;

    if (!booked && !skipped) return queues;

    return queues.filter(
      (queue) =>
        (booked && queue.status === QueueStatus.BOOKED) ||
        (skipped && queue.status === QueueStatus.SKIPPED)
    );
  }, [nextQueues, selectedFilters]);

  const filteredPreviousQueues = useMemo(() => {
    const queues = previousQueues ?? [];
    const { completed, cancelled } = selectedFilters;

    if (!completed && !cancelled) return queues;

    return queues.filter(
      (queue) =>
        (completed && queue.status === QueueStatus.COMPLETED) ||
        (cancelled && queue.status === QueueStatus.CANCELLED)
    );
  }, [previousQueues, selectedFilters]);

  if (!data && !isLoading) {
    return <MinimalPlaceholder message="No queues found" isLoading={false} />;
  }

  return (
    <FormProvider {...prescriptionForm}>
      <div
        className="relative flex h-[calc(100vh-58px)] divide-x-1 divide-divider"
        data-test-id="appointment-queues"
      >
        <div className="relative flex w-full flex-col justify-start" data-test-id="current-queue">
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
                <CompletedAppointmentQueue currentQueue={currentQueue} />
              )}
            </>
          ) : (
            <MinimalPlaceholder message="Nothing to show here" isLoading={false} />
          )}

          <QueueFooter currentQueue={currentQueue} />
          <div className="absolute right-0 top-14">
            <Tooltip content="Show next appointments" placement="left">
              <Button
                isIconOnly
                radius="full"
                size="sm"
                variant="flat"
                onPress={() => setShowNextQueues(!showNextQueues)}
              >
                {showNextQueues ? (
                  <Icon icon="heroicons:chevron-right" />
                ) : (
                  <Icon icon="heroicons:chevron-left" />
                )}
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* next queues */}
        {showNextQueues && (
          <div className="h-full w-full max-w-[400px] overflow-hidden" data-test-id="next-queues">
            <Tabs
              aria-label="Queues"
              classNames={{
                panel: 'h-full overflow-hidden',
                base: 'px-2 pt-2',
              }}
            >
              <Tab key="upcoming" title="Upcoming">
                <div className="flex items-center gap-2 px-2 pb-2">
                  <Chip
                    as={Button}
                    size="sm"
                    variant={selectedFilters.booked ? 'solid' : 'bordered'}
                    onPress={() =>
                      setSelectedFilters((prev) => ({ ...prev, booked: !prev.booked }))
                    }
                  >
                    Booked
                  </Chip>
                  <Chip
                    as={Button}
                    size="sm"
                    variant={selectedFilters.skipped ? 'solid' : 'bordered'}
                    color="warning"
                    onPress={() =>
                      setSelectedFilters((prev) => ({ ...prev, skipped: !prev.skipped }))
                    }
                  >
                    Skipped
                  </Chip>
                </div>
                <QueuesList
                  queues={filteredNextQueues}
                  onSelect={(queueId) => setQueueId(queueId)}
                  className="w-full"
                />
              </Tab>
              <Tab key="completed" title="Completed">
                <div className="flex items-center gap-2 px-2 pb-2">
                  <Chip
                    as={Button}
                    size="sm"
                    color="success"
                    variant={selectedFilters.completed ? 'solid' : 'bordered'}
                    onPress={() =>
                      setSelectedFilters((prev) => ({ ...prev, completed: !prev.completed }))
                    }
                  >
                    Completed
                  </Chip>
                  <Chip
                    as={Button}
                    size="sm"
                    variant={selectedFilters.cancelled ? 'solid' : 'bordered'}
                    color="danger"
                    onPress={() =>
                      setSelectedFilters((prev) => ({ ...prev, cancelled: !prev.cancelled }))
                    }
                  >
                    Cancelled
                  </Chip>
                </div>
                <QueuesList
                  queues={filteredPreviousQueues}
                  onSelect={(queueId) => setQueueId(queueId)}
                  className="w-full"
                />
              </Tab>
            </Tabs>
          </div>
        )}
      </div>
    </FormProvider>
  );
}
