'use client';

import { useState } from 'react';

// import { UserQuickLook } from './quicklook';
// import { useDoctorStore } from './store';

import { Table } from '@/components/ui/new-data-table';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import { AppointmentQueueType } from '@/services/client/appointment/queue/queue.types';
import QueueQuickLook from './quicklook';

export default function DefaultQueueView() {
  const [selectedQueue, setSelectedQueue] = useState<AppointmentQueueType | null>(null);

  const { data } = useAllAppointmentQueues();

  const { columns = [], rows = {} } = data || {};
  console.log({ columns, rows });

  return (
    <>
      <Table columns={columns} rows={rows} />

      {!!selectedQueue && (
        <QueueQuickLook queue={selectedQueue} onClose={() => setSelectedQueue(null)} />
      )}
    </>
  );
}
