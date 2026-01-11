import Modal from '@/components/ui/modal';
import { useAppointmentStore } from '@/services/client/appointment/appointment.store';
import { useCancelAppointment } from '../appointment.query';
import { Textarea } from '@heroui/react';
import { useState } from 'react';

export default function CancelModal() {
  const { setAction, aid } = useAppointmentStore();
  const { mutateAsync: cancelAppointment } = useCancelAppointment();

  const [remarks, setRemarks] = useState('');

  const handleSubmit = async () => {
    if (!aid) return;
    await cancelAppointment({ aid, remarks });
  };

  const renderBody = () => {
    return (
      <div>
        <Textarea
          isRequired
          label="Cancellation Remarks"
          placeholder="Enter cancellation remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen
      title="Cancel Appointment"
      subtitle="You can cancel the appointment by providing a reason for cancellation."
      body={renderBody()}
      onClose={() => setAction(null)}
      submitButton={{ children: 'Cancel Appointment', color: 'danger', isDisabled: !remarks }}
      onSubmit={handleSubmit}
      cancelButton={{ children: 'Keep' }}
      classNames={{
        body: 'bg-transparent',
      }}
    />
  );
}
