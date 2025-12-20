import { cn } from '@/lib/utils';
import { AppointmentQueueType } from '@/services/client/appointment/queue/types';
import { Accordion, AccordionItem, Card, CardHeader, CardBody, ScrollShadow } from '@heroui/react';
import Avatar from 'boring-avatars';
import { useState } from 'react';

export default function NextQueues({ nextQueues }: { nextQueues: AppointmentQueueType[] }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['']));

  return (
    <ScrollShadow className="h-[calc(100vh-58px)] w-1/4 p-2">
      <Accordion
        hideIndicator
        isCompact
        showDivider={false}
        itemClasses={{ trigger: 'py-0', content: 'py-0' }}
        className="space-y-2"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
      >
        {nextQueues.map((queue) => (
          <AccordionItem
            key={queue.id}
            title={
              <Card
                key={queue.id}
                className={cn(
                  'rounded-small border border-l-5 border-divider border-l-primary bg-primary-50 shadow-none transition-all',
                  {
                    'rounded-b-none border-b-0': selectedKeys.has(queue.id),
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
              </Card>
            }
          >
            <div className="rounded-b-small border border-l-5 border-t-0 border-divider border-l-primary p-4">
              {queue.patient.name}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollShadow>
  );
}
