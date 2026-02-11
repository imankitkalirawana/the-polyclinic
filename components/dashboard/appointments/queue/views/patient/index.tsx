'use client';

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
  const { data: appointments } = useGroupedAppointmentQueuesForPatient();
  const [appointmentStatus, setAppointmentStatus] = useQueryState(
    'status',
    parseAsStringEnum(Object.values(AppointmentStatus)).withDefault(AppointmentStatus.ALL)
  );
  const totalAppointments =
    (appointments?.metaData?.totalNext ?? 0) +
    (appointments?.metaData?.totalPrevious ?? 0) +
    (appointments?.current ? 1 : 0);

  const getNextAppointmentsCount = () => {
    const nextCount = appointments?.metaData?.totalNext || 0;

    if (appointments?.current) {
      return nextCount + 1;
    }
    return nextCount;
  };

  return (
    <div className="p-4">
      <Tabs
        aria-label="My appointments"
        className="p-4"
        selectedKey={appointmentStatus}
        onSelectionChange={(key) => setAppointmentStatus(key as AppointmentStatus)}
      >
        <Tab
          key={AppointmentStatus.ALL}
          title={
            <div className="flex items-center gap-2">
              <span>All</span>
              <Chip size="sm" variant="flat">
                {totalAppointments}
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
                {getNextAppointmentsCount()}
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
                {appointments?.metaData.totalPrevious}
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
