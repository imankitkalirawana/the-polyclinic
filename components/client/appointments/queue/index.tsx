'use client';

import { CellRenderer } from '@/components/ui/cell-renderer';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { cn } from '@/lib/utils';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/query';
import { QueueStatus } from '@/services/client/appointment/queue/types';
import { Accordion, AccordionItem, Button, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { formatDate } from 'date-fns';
import { useState } from 'react';
import NextQueues from './next-queues';
import PrescriptionPanel from './priscription-panel';
import Medicines from './medicines';

export default function Queues() {
  const { data } = useAllAppointmentQueues();
  const [selectedKeys, setSelectedKeys] = useState(new Set(['']));

  if (!data) {
    return <MinimalPlaceholder message="No queues found" isLoading={false} />;
  }

  const currentQueue = data[0];
  const nextQueues = data.slice(1);

  return (
    <div
      className="flex h-[calc(100vh-58px)] divide-x-1 divide-divider"
      data-test-id="appointment-queues"
    >
      {/* current queue */}
      <div
        className="flex w-3/4 flex-col justify-between divide-y-1 divide-divider"
        data-test-id="current-queue"
      >
        <div className="flex items-center justify-start gap-8 p-4">
          <div className="aspect-square">
            <h2 className="text-7xl font-bold text-primary">{currentQueue.sequenceNumber}</h2>
          </div>
          <div className="grid w-full grid-cols-3 gap-2">
            <CellRenderer
              icon="solar:user-bold-duotone"
              label="Name"
              value={currentQueue.patient.name}
              className="p-0"
              classNames={{
                icon: 'text-blue-500 bg-blue-100',
              }}
            />
            {currentQueue.patient.gender && (
              <CellRenderer
                icon="solar:men-bold-duotone"
                label="Gender"
                value={currentQueue.patient.gender}
                className="p-0"
                classNames={{
                  icon: 'text-green-500 bg-green-100',
                }}
              />
            )}
            {currentQueue.patient.age && (
              <CellRenderer
                icon="solar:user-bold-duotone"
                label="Age"
                value={`${currentQueue.patient.age} ${currentQueue.patient.age === 1 ? 'year' : 'years'}`}
                className="p-0"
                classNames={{
                  icon: 'text-red-500 bg-red-100',
                }}
              />
            )}
            {currentQueue.patient.phone && (
              <CellRenderer
                icon="solar:phone-rounded-bold-duotone"
                label="Phone"
                value={currentQueue.patient.phone}
                className="p-0"
                classNames={{
                  icon: 'text-cyan-500 bg-cyan-100',
                }}
              />
            )}
            {currentQueue.patient.email && (
              <CellRenderer
                icon="solar:letter-bold-duotone"
                label="Email"
                value={currentQueue.patient.email}
                className="p-0"
                classNames={{
                  icon: 'text-yellow-500 bg-yellow-100',
                }}
              />
            )}
            <CellRenderer
              icon="solar:clock-circle-bold-duotone"
              label="Booked At"
              value={formatDate(new Date(currentQueue.createdAt), 'PPp')}
              className="p-0"
              classNames={{
                icon: 'text-pink-500 bg-pink-100',
              }}
            />
          </div>
        </div>
        <Accordion
          hideIndicator
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
          className="border-b border-divider bg-default-100"
          itemClasses={{
            trigger: 'py-0.5',
          }}
        >
          <AccordionItem
            key="view-more-details"
            aria-label="More details"
            title={
              <div className="flex w-full items-center justify-center gap-1 py-0.5 text-center text-small">
                <span>View more details</span>
                <Icon
                  icon="solar:alt-arrow-down-line-duotone"
                  className={cn(
                    'transition-transform duration-300',
                    selectedKeys.has('view-more-details') ? 'rotate-180' : ''
                  )}
                  width="18"
                />
              </div>
            }
          >
            Hello
          </AccordionItem>
        </Accordion>
        <ScrollShadow className="h-full">
          <PrescriptionPanel />
          <Medicines />
        </ScrollShadow>
        <div className="flex justify-end gap-2 p-2 px-4">
          {currentQueue.status === QueueStatus.BOOKED ? (
            <Button color="primary">Call Patient</Button>
          ) : (
            <div className="flex w-full justify-between">
              <Button variant="bordered">Skip</Button>
              <Button color="primary">Mark as Completed</Button>
            </div>
          )}
        </div>
      </div>
      {/* next queues */}
      <NextQueues nextQueues={nextQueues} />
    </div>
  );
}
