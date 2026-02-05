import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { cn } from '@heroui/react';
import { AppointmentQueueType, QueueStatus } from '@/services/client/appointment/queue/queue.types';
import {
  Accordion,
  AccordionItem,
  Avatar as HerouiAvatar,
  Card,
  CardHeader,
  CardBody,
  ScrollShadow,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Avatar from 'boring-avatars';
import { formatDate } from 'date-fns';
import { useState } from 'react';
import { getQueueStatusColor } from './helper';
import { formatGender } from '@/libs/utils';

export default function QueuesList({
  isLoading,
  queues,
  className,
  onSelect,
}: {
  isLoading?: boolean;
  queues: AppointmentQueueType[];
  className?: string;
  onSelect?: (queueId: string) => void;
}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['']));

  return (
    <ScrollShadow className={cn('h-full w-full pb-20', className)}>
      {isLoading ? (
        <MinimalPlaceholder message="Loading appointments..." isLoading={true} />
      ) : queues.length > 0 ? (
        <Accordion
          hideIndicator
          isCompact
          showDivider={false}
          itemClasses={{ trigger: 'py-0', content: 'py-0' }}
          className="space-y-2"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        >
          {queues.map((queue) => (
            <AccordionItem
              key={queue.id}
              title={
                <Card
                  key={queue.id}
                  className={cn(
                    'group rounded-small border border-l-5 border-divider border-l-default bg-default-50 shadow-none transition-all',
                    {
                      'rounded-b-none border-b-0': selectedKeys.has(queue.id),
                    },
                    getQueueStatusColor(queue.status)
                  )}
                >
                  <CardHeader className="justify-between">
                    <div className="flex items-center gap-3">
                      {queue.patient.image ? (
                        <HerouiAvatar src={queue.patient.image} size="sm" />
                      ) : (
                        <Avatar name={queue.patient.name} size={30} />
                      )}
                      <span className="font-medium text-default-500 text-small">
                        {queue.patient.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="flat"
                        className="opacity-0 transition-all group-hover:opacity-100"
                        size="sm"
                        onPress={() => onSelect?.(queue.id)}
                        endContent={<Icon icon="solar:arrow-right-line-duotone" width={16} />}
                      >
                        View
                      </Button>
                      <span className="font-bold text-primary-500 text-large">
                        {queue.sequenceNumber}
                      </span>
                    </div>
                  </CardHeader>
                  <CardBody className="grid w-full grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-default-500 text-tiny">Age</span>
                      <p className="capitalize text-small">
                        {queue.patient.age
                          ? `${queue.patient.age} ${queue.patient.age === 1 ? 'year' : 'years'}`
                          : '-'}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-default-500 text-tiny">Gender</span>
                      <p className="capitalize text-small">
                        {formatGender(queue.patient.gender, { fullString: true })}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              }
            >
              <div
                className={cn(
                  'rounded-b-small border border-l-5 border-t-0 border-divider border-l-default p-4',
                  getQueueStatusColor(queue.status)
                )}
              >
                <div className="grid w-full grid-cols-2 gap-2">
                  {queue.status === QueueStatus.COMPLETED && (
                    <>
                      <div className="flex flex-col">
                        <span className="text-default-500 text-tiny">Age</span>
                        <p className="capitalize text-small">
                          {queue.patient.age
                            ? `${queue.patient.age} ${queue.patient.age === 1 ? 'year' : 'years'}`
                            : '-'}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-default-500 text-tiny">Gender</span>
                        <p className="capitalize text-small">
                          {queue.patient.gender ? `${queue.patient.gender.toLowerCase()}` : '-'}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col">
                    <span className="text-default-500 text-tiny">Phone</span>
                    <p className="capitalize text-small">{queue.patient.phone || '-'}</p>
                  </div>

                  <div title={queue.patient.email} className="flex flex-col">
                    <span className="text-default-500 text-tiny">Email</span>
                    <p className="truncate lowercase text-small">{queue.patient.email || '-'}</p>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-default-500 text-tiny">Booked At</span>
                    <p className="capitalize text-small">
                      {formatDate(new Date(queue.createdAt), 'PPp')}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-default-500 text-tiny">Booked By</span>
                    <p className="capitalize text-small">
                      {queue.bookedByUser.id === queue.patient.user_id
                        ? 'Self'
                        : queue.bookedByUser.name}
                    </p>
                  </div>

                  {queue.notes && (
                    <div className="col-span-full flex flex-col">
                      <span className="text-default-500 text-tiny">Patient Note</span>
                      <p className="capitalize text-small">{queue.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <MinimalPlaceholder message="Nothing to show here" isLoading={false} />
      )}
    </ScrollShadow>
  );
}
