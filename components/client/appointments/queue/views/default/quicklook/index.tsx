import RichColorCell from '@/components/ui/cell/rich-color';
import QuickLook from '@/components/ui/quicklook';
import { AppointmentQueueResponse } from '@/services/client/appointment/queue/queue.types';

interface QueueQuickLookProps {
  queue: AppointmentQueueResponse;
  onClose: () => void;
}

export default function QueueQuickLook({ queue, onClose }: QueueQuickLookProps) {
  const content = (
    <>
      <RichColorCell type="key" label="Reference Number" value={queue.referenceNumber} />
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

  const sidebarContent = (
    <div>
      <h1>Sidebar</h1>
    </div>
  );

  return (
    <QuickLook
      title={`Appointment Token #${queue.sequenceNumber}`}
      content={content}
      sidebarContent={sidebarContent}
      footerLeft={<div>Footer Left</div>}
      footerRight={<div>Footer Right</div>}
      onClose={onClose}
    />
  );
}
