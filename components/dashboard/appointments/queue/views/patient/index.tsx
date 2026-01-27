'use client';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import { Chip, Tab, Tabs } from '@heroui/react';
import AllAppointments from './all-appointments';
import Upcoming from './upcoming';
import Completed from './completed';
import { useGroupedAppointmentQueuesForPatient } from '@/services/client/appointment/queue/queue.query';

export default function PatientQueueView() {
  const { data: appointments } = useAllAppointmentQueues();
  const { data: groupedAppointments } = useGroupedAppointmentQueuesForPatient();

  return (
    <div className="p-4">
      <Tabs aria-label="My appointments" className="p-4">
        <Tab
          key="all"
          title={
            <div className="flex items-center gap-2">
              <span>All</span>
              <Chip size="sm" variant="flat">
                {appointments?.length}
              </Chip>
            </div>
          }
        >
          <AllAppointments />
        </Tab>
        <Tab
          key="upcoming"
          title={
            <div className="flex items-center gap-2">
              <span>Upcoming</span>

              <Chip size="sm" variant="flat">
                {(groupedAppointments?.next.length ?? 0) + (groupedAppointments?.current ? 1 : 0)}
              </Chip>
            </div>
          }
        >
          <Upcoming />
        </Tab>
        <Tab
          key="previous"
          title={
            <div className="flex items-center gap-2">
              <span>Previous</span>
              <Chip size="sm" variant="flat">
                {groupedAppointments?.previous.length}
              </Chip>
            </div>
          }
        >
          <Completed />
        </Tab>
      </Tabs>
    </div>
  );
}
