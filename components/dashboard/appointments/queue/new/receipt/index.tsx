'use client';

import React from 'react';
import {
  Button,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import {
  useAppointmentQueueById,
  useDownloadReceipt,
} from '@/services/client/appointment/queue/queue.query';
import { useFormContext } from 'react-hook-form';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import { useSession } from '@/libs/providers/session-provider';
import { formatDate } from 'date-fns';

export default function AppointmentQueueReceipt() {
  const form = useFormContext<CreateAppointmentQueueFormValues>();
  const { user } = useSession();
  const appointmentId = form.watch('appointment.queueId');
  const { data: appointment, isLoading: isAppointmentLoading } =
    useAppointmentQueueById(appointmentId);

  const { mutate: downloadReceipt, isPending: isDownloadReceiptPending } = useDownloadReceipt();

  if (isAppointmentLoading) {
    return <Skeleton className="h-4 w-24" />;
  }

  return (
    <Modal
      isOpen
      backdrop="blur"
      scrollBehavior="inside"
      hideCloseButton={user?.role === 'PATIENT'}
      isDismissable={false}
      onOpenChange={() => {
        form.reset();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex-col items-center border-b border-divider">
          <Icon
            className="mb-3 text-success-500"
            icon="solar:check-circle-bold-duotone"
            width={56}
          />
          <p className="mb-2 text-base font-medium">Appointment Booked</p>
          <p className="text-center font-normal text-default-500 text-small">
            We sent a confirmation email to the patient and the doctor.
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full items-center justify-between text-small">
              <p className="text-default-500 text-tiny">Token Number</p>
              <p className="font-medium">{appointment?.sequenceNumber}</p>
            </div>
            <div className="flex w-full items-center justify-between text-small">
              <p className="text-default-500 text-tiny">Patient Name</p>
              <p className="font-medium">{appointment?.patient?.name}</p>
            </div>
            <div className="flex w-full items-center justify-between text-small">
              <p className="text-default-500 text-tiny">Doctor</p>
              <p className="font-medium">{appointment?.doctor?.name}</p>
            </div>
            <div className="flex w-full items-center justify-between text-small">
              <p className="text-default-500 text-tiny">Reference Number</p>
              {/* only last 6 digits of the appointment id */}
              <p className="font-medium uppercase">{appointment?.aid}</p>
            </div>
            <div className="flex w-full items-center justify-between text-small">
              <p className="text-default-500 text-tiny">Payment Mode</p>
              <p className="font-medium">{appointment?.paymentMode}</p>
            </div>
            <div className="flex w-full items-center justify-between text-small">
              <p className="text-default-500 text-tiny">Booked On</p>
              <p className="font-medium">
                {formatDate(new Date(appointment?.createdAt || ''), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <Divider className="w-full bg-default-100" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-default-500 text-small">Add to calendar</p>
            <div className="flex items-center gap-2">
              <Button isIconOnly className="bg-default-100" size="sm">
                <Icon className="text-default-600" icon="mdi:google" width={16} />
              </Button>
              <Button isIconOnly className="bg-default-100" size="sm">
                <Icon className="text-default-600" icon="mdi:microsoft-outlook" width={16} />
              </Button>
              <Button isIconOnly className="bg-default-100" size="sm">
                <Icon className="text-default-600" icon="mdi:microsoft-office" width={16} />
              </Button>
              <Button isIconOnly className="bg-default-100" size="sm">
                <Icon className="text-default-600" icon="mdi:calendar-outline" width={16} />
              </Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-divider">
          <Button
            fullWidth
            variant="bordered"
            startContent={<Icon icon="solar:cloud-download-bold-duotone" width={18} />}
            isLoading={isDownloadReceiptPending}
            onPress={() => {
              downloadReceipt(appointmentId || '');
            }}
          >
            Download Receipt
          </Button>
          <Button
            fullWidth
            variant="shadow"
            color="primary"
            as={Link}
            // TODO: Add redirect URL here
          >
            View Appointment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
