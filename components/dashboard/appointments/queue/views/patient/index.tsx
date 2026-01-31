'use client';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import { Chip, Tab, Tabs } from '@heroui/react';
import AllAppointments from './all-appointments';
import Upcoming from './upcoming';
import Completed from './completed';
import { useGroupedAppointmentQueuesForPatient } from '@/services/client/appointment/queue/queue.query';
import { parseAsStringEnum, useQueryState } from 'nuqs';

enum AppointmentStatus {
  ALL = 'all',
  UPCOMING = 'upcoming',
  PREVIOUS = 'previous',
}

export default function PatientQueueView() {
  const { data: appointments } = useAllAppointmentQueues();
  const { data: groupedAppointments } = useGroupedAppointmentQueuesForPatient();
  const [appointmentStatus, setAppointmentStatus] = useQueryState(
    'status',
    parseAsStringEnum(Object.values(AppointmentStatus)).withDefault(AppointmentStatus.ALL)
  );

  return (
    <div className="p-4">
      <Tabs
        aria-label="My appointments"
        className="p-4"
        selectedKey={appointmentStatus}
        // TODO: fix type error
        onSelectionChange={(key) => setAppointmentStatus(key as AppointmentStatus)}
      >
        <Tab
          key={AppointmentStatus.ALL}
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
          key={AppointmentStatus.UPCOMING}
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
          key={AppointmentStatus.PREVIOUS}
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
