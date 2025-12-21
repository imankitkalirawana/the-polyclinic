import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { cn } from '@/lib/utils';
import { AppointmentQueueType, QueueStatus } from '@/services/client/appointment/queue/types';
import { Accordion, AccordionItem, Card, CardHeader, CardBody, ScrollShadow } from '@heroui/react';
import Avatar from 'boring-avatars';
import { formatDate } from 'date-fns';
import { useState } from 'react';

export default function QueuesList({
  queues,
  className,
}: {
  queues: AppointmentQueueType[];
  className?: string;
}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['']));

  return (
    <ScrollShadow className={cn('h-[calc(100vh-58px)] w-1/4 p-2', className)}>
      {queues.length > 0 ? (
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
                    'rounded-small border border-l-5 border-divider border-l-default bg-default-50 shadow-none transition-all',
                    {
                      'rounded-b-none border-b-0': selectedKeys.has(queue.id),
                      'border-l-success': queue.status === QueueStatus.COMPLETED,
                      'border-l-warning': queue.status === QueueStatus.SKIPPED,
                      'border-l-danger': queue.status === QueueStatus.CANCELLED,
                    }
                  )}
                >
                  <CardHeader className="justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={queue.patient.name} size={30} />
                      <span className="font-medium text-default-500 text-small">
                        {queue.patient.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-500 text-large">
                        {queue.sequenceNumber}
                      </span>
                    </div>
                  </CardHeader>
                  {queue.status !== QueueStatus.COMPLETED && (
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
                          {queue.patient.gender ? `${queue.patient.gender.toLowerCase()}` : '-'}
                        </p>
                      </div>
                    </CardBody>
                  )}
                </Card>
              }
            >
              <div
                className={cn(
                  'rounded-b-small border border-l-5 border-t-0 border-divider border-l-default p-4',
                  {
                    'border-l-success': queue.status === QueueStatus.COMPLETED,
                    'border-l-warning': queue.status === QueueStatus.SKIPPED,
                    'border-l-danger': queue.status === QueueStatus.CANCELLED,
                  }
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
                    <span className="text-default-500 text-tiny">Booked At</span>
                    <p className="capitalize text-small">
                      {formatDate(new Date(queue.createdAt), 'PPp')}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-default-500 text-tiny">Booked By</span>
                    <p className="capitalize text-small">{queue.bookedByUser.name}</p>
                  </div>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <MinimalPlaceholder message="Nothing next, sit back and relax" isLoading={false} />
      )}
    </ScrollShadow>
  );
}
