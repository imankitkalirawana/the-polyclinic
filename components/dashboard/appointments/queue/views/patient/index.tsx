'use client';
import { useAllAppointmentQueues } from '@/services/client/appointment/queue/queue.query';
import type { RowData } from '@/components/ui/new-data-table/types';
import { Card, Chip, Tab, Tabs } from '@heroui/react';

export default function PatientQueueView() {
  const { data } = useAllAppointmentQueues();
  const rows: RowData[] = data?.rows ?? [];

  return (
    <div className="p-4">
      <h1>My appointments</h1>
      <Tabs aria-label="My appointments">
        <Tab
          key="upcoming"
          title={
            <div className="flex items-center gap-2">
              <span>Upcoming</span>
              <Chip size="sm" variant="flat">
                {rows.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-2">
            {rows.map((row, index) => (
              <Card key={row.id?.value ?? index} isPressable>
                <p>{row.sequenceNumber?.value ?? ''}</p>
              </Card>
            ))}
          </div>
        </Tab>
        <Tab
          key="previous"
          title={
            <div className="flex items-center gap-2">
              <span>Previous</span>
              <Chip size="sm" variant="flat">
                {rows.length}
              </Chip>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-2">
            {rows.map((row, index) => (
              <Card key={row.id?.value ?? index} isPressable>
                <p>{row.sequenceNumber?.value ?? ''}</p>
              </Card>
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
