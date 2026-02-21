import RichColorCell from '@/components/ui/cell/rich-color';
import QuickLook from '@/components/ui/quicklook';
import { AppointmentQueue } from '@repo/store';
import QueueActivityLogs from './activity-logs';

interface QueueQuickLookProps {
  queue: AppointmentQueue;
  onClose: () => void;
}

export default function QueueQuickLook({ queue, onClose }: QueueQuickLookProps) {
  const content = (
    <>
      <RichColorCell type="key" label="Appointment ID" value={queue.aid} />
      <RichColorCell type="name" value={queue.patient.name} />
      <RichColorCell type="phone" value={queue.patient.phone} />
      <RichColorCell type="email" value={queue.patient.email} />
      <RichColorCell type="age" value={queue.patient.age} />
      <RichColorCell type="gender" value={queue.patient.gender} />
      <RichColorCell type="datetime" label="Booked At" value={queue.createdAt} />
      <RichColorCell
        type="text"
        label="Booked By"
        value={`${queue.bookedByUser.name} (${queue.bookedByUser.email})`}
      />
    </>
  );

  return (
    <QuickLook
      title={`Appointment Token #${queue.sequenceNumber}`}
      content={content}
      sidebarContent={<QueueActivityLogs queueId={queue.id} />}
      footerLeft={<div>Footer Left</div>}
      footerRight={<div>Footer Right</div>}
      onClose={onClose}
    />
  );
}
