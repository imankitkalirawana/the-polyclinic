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
import { useQueryState, parseAsIsoDateTime } from 'nuqs';
import DetailsHeader from './details-header';
import QueueFooter from './footer';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useMemo } from 'react';
import CompletedAppointmentQueue from './completed';
import { useSession } from '@/libs/providers/session-provider';
import DateScroll from '../../../(common)/date-scroll';

export default function QueuesDoctorView() {
  const session = useSession();
  const [queueId, setQueueId] = useQueryState('id');
  const [showNextQueues, setShowNextQueues] = useLocalStorage('show-next-queues', true);
  const [selectedDate, setSelectedDate] = useQueryState('date', parseAsIsoDateTime);
  const [selectedFilters, setSelectedFilters] = useState({
    booked: false,
    skipped: false,
    completed: false,
    cancelled: false,
  });

  const { data, isLoading } = useQueueForDoctor(
    session?.user?.integrated_user_id,
    queueId,
    selectedDate
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

  return (
    <FormProvider {...prescriptionForm}>
      <div
        className="divide-divider relative flex h-[calc(100vh-58px)] divide-x overflow-hidden"
        data-testid="appointment-queues"
      >
        <div
          className="relative flex min-w-0 flex-1 flex-col justify-start"
          data-testid="current-queue"
        >
          <DateScroll selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          {isLoading ? (
            <MinimalPlaceholder message="Loading appointment..." isLoading={true} />
          ) : currentQueue ? (
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
          <div className="absolute top-1/2 right-0 -translate-y-1/2">
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
          <div className="h-full w-[400px] shrink-0 overflow-hidden" data-testid="next-queues">
            <Tabs
              aria-label="Queues"
              classNames={{
                panel: 'h-full overflow-hidden',
                base: 'px-2 pt-2',
              }}
            >
              <Tab
                key="upcoming"
                title={
                  <div className="flex items-center gap-2">
                    <span>Upcoming</span>
                    <Chip size="sm" variant="flat">
                      {filteredNextQueues.length}
                    </Chip>
                  </div>
                }
              >
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
                  isLoading={isLoading}
                  queues={filteredNextQueues}
                  onSelect={(queueId) => setQueueId(queueId)}
                  className="w-full"
                />
              </Tab>
              <Tab
                key="completed"
                title={
                  <div className="flex items-center gap-2">
                    <span>Completed</span>
                    <Chip size="sm" variant="flat">
                      {filteredPreviousQueues.length}
                    </Chip>
                  </div>
                }
              >
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
                  isLoading={isLoading}
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
