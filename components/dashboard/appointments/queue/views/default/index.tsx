'use client';

import { useMemo, useState } from 'react';

// import { UserQuickLook } from './quicklook';
// import { useDoctorStore } from './store';

import { Table } from '@/components/ui/new-data-table';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import { AppointmentQueueType } from '@/services/client/appointment/queue/queue.types';
import QueueQuickLook from './quicklook';
import QueueColumns from './columns';
import { Input } from '@heroui/react';

export default function DefaultQueueView() {
  const [selectedQueue, setSelectedQueue] = useState<AppointmentQueueType | null>(null);

  const { data, dataUpdatedAt } = useAllAppointmentQueues();

  const { columns = [], rows = [] } = data || {};

  const topContent = useMemo(
    () => (
      <div className="flex items-center justify-between gap-4 px-[6px] py-[4px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            <Input className="min-w-[200px]" placeholder="Search" size="sm" />
          </div>
        </div>
        <QueueColumns />
      </div>
    ),
    []
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-[300px] flex-1">
        <Table data={rows} columns={columns} topContent={topContent} tableKey={dataUpdatedAt} />
      </div>
      {!!selectedQueue && (
        <QueueQuickLook queue={selectedQueue} onClose={() => setSelectedQueue(null)} />
      )}
    </div>
  );
}
