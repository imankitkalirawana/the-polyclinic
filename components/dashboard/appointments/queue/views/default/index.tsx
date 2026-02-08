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

  const { columns = [], rows = [] } = data || {};

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-[300px] flex-1">
        <Table data={rows} columns={columns} />
      </div>
      {!!selectedQueue && (
        <QueueQuickLook queue={selectedQueue} onClose={() => setSelectedQueue(null)} />
      )}
    </div>
  );
}
