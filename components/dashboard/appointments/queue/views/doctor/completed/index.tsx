import DataItem from '@/components/ui/data-item';
import { AppointmentQueueType } from '@/services/client/appointment/queue/queue.types';
import { formatDate } from 'date-fns';

export default function CompletedAppointmentQueue({
  currentQueue,
}: {
  currentQueue: AppointmentQueueType;
}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <DataItem label="Title" value={currentQueue.title} />
      <div className="flex flex-col">
        <span className="text-default-500 text-tiny">Prescription</span>
        <div
          className="text-small"
          dangerouslySetInnerHTML={{ __html: currentQueue.prescription }}
        />
      </div>
      <DataItem label="Patient Notes" value={currentQueue.notes || 'No patient notes provided'} />
      <DataItem
        label="Completed By"
        value={
          `${currentQueue.completedByUser?.name} (${currentQueue.completedByUser?.email}) on ${formatDate(new Date(currentQueue.updatedAt), 'PPp')}` ||
          'N/A'
        }
      />
      <DataItem label="Payment Mode" value={currentQueue.paymentMode} />
    </div>
  );
}
