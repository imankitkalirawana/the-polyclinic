'use client';
import { changeAppointmentStatus } from '@/functions/server-actions';
import { AppointmentType } from '@/models/Appointment';
import {
  Alert,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader
} from '@heroui/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CancelAppointment({
  appointment,
  modal,
  setAppointments
}: {
  appointment: AppointmentType;
  modal: any;
  setAppointments: any;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <ModalHeader className="flex-col items-start gap-4">
        <h2 className="mt-4 max-w-xs text-center text-base">
          Cancel Appointment
        </h2>
        <p className="text-sm font-light">
          This appointment will be cancelled and the patient will be notified.
        </p>
      </ModalHeader>
      <ModalBody>
        <Alert
          color="danger"
          title={<p>This action is not reversible. Please be certain.</p>}
        />
      </ModalBody>
      <ModalFooter className="flex-col-reverse sm:flex-row">
        <Button
          fullWidth
          color="default"
          onPress={() => {
            modal.onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          color="danger"
          variant="flat"
          isLoading={isLoading}
          onPress={async () => {
            setIsLoading(true);
            await changeAppointmentStatus(appointment._id, 'cancelled')
              .then(() => {
                setAppointments((prev: AppointmentType[]) => {
                  const updatedAppointments = prev.filter(
                    (item) => item._id !== appointment._id
                  );
                  return updatedAppointments;
                });
                toast.success('Appointment cancelled');
                modal.onClose();
              })
              .catch((error) => {
                console.error(error);
                toast.error('An error occurred');
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
        >
          Confirm
        </Button>
      </ModalFooter>
    </>
  );
}
