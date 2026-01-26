'use client';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import { Chip, Tab, Tabs } from '@heroui/react';
import AllAppointments from './all-appointments';

export default function PatientQueueView() {
  const { data: appointments } = useAllAppointmentQueues();

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
        ></Tab>
        <Tab
          key="upcoming"
          title={
            <div className="flex items-center gap-2">
              <span>Upcoming</span>
              <Chip size="sm" variant="flat">
                {appointments?.length}
              </Chip>
            </div>
          }
        ></Tab>
        <Tab
          key="previous"
          title={
            <div className="flex items-center gap-2">
              <span>Previous</span>
              <Chip size="sm" variant="flat">
                {appointments?.length}
              </Chip>
            </div>
          }
        ></Tab>
      </Tabs>
      <AllAppointments />
    </div>
  );
}
