import { cn } from '@heroui/react';
import { getQueueStatusColor } from '../helper';
import { CellRenderer } from '@/components/ui/cell/rich-color/cell-renderer';
import { Accordion, AccordionItem, Chip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AppointmentQueueType } from '@/services/client/appointment/queue/queue.types';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DataItem from '@/components/ui/data-item';
import { formatDate } from 'date-fns';
import { formatGender } from '@/libs/utils';

export default function DetailsHeader({ currentQueue }: { currentQueue: AppointmentQueueType }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['']));
  const [isDetailsOpen, setIsDetailsOpen] = useLocalStorage('is-queue-details-open', false);

  useEffect(() => {
    if (isDetailsOpen) {
      setSelectedKeys(new Set(['view-more-details']));
    }
  }, [isDetailsOpen]);

  return (
    <div className="relative flex flex-col">
      <div
        className={cn(
          'flex items-center justify-start gap-8 border-l-8 border-l-default p-4',
          getQueueStatusColor(currentQueue.status)
        )}
      >
        <div className="absolute right-2 top-2">
          <Chip color="primary" size="sm" className="capitalize" variant="dot">
            {currentQueue.status.split('_').join(' ').toLowerCase()}
          </Chip>
        </div>
        <div className="aspect-square">
          <h2 className="text-7xl font-bold text-primary">{currentQueue.sequenceNumber}</h2>
        </div>
        <div className="grid w-full grid-cols-3 gap-2">
          <CellRenderer
            icon="solar:key-minimalistic-bold-duotone"
            label="Appointment ID"
            value={currentQueue.aid}
            className="p-0"
            classNames={{
              icon: 'text-pink-500 bg-pink-100',
            }}
          />
          <CellRenderer
            icon="solar:user-bold-duotone"
            label="Name"
            value={currentQueue.patient.name}
            className="p-0"
            classNames={{
              icon: 'text-blue-500 bg-blue-100',
            }}
          />
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
          {currentQueue.patient.gender && (
            <CellRenderer
              icon="solar:men-bold-duotone"
              label="Gender"
              value={formatGender(currentQueue.patient.gender, { fullString: true })}
              className="p-0"
              classNames={{
                icon: 'text-green-500 bg-green-100',
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
        </div>
      </div>
      <Accordion
        hideIndicator
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          setSelectedKeys(keys as Set<string>);
          const keysSet = keys as Set<string>;
          setIsDetailsOpen(keysSet.has('view-more-details'));
        }}
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
          <div className="flex flex-col gap-2">
            <DataItem
              label="Booked At"
              value={formatDate(new Date(currentQueue.createdAt), 'PPp')}
            />
            <DataItem
              label="Patient Note"
              value={currentQueue.notes || 'No additional information provided.'}
            />
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
