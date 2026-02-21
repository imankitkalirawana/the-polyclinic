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
  useAppointmentQueueByAid,
  useDownloadReceipt,
} from '@/services/client/appointment/queue/queue.query';
import { useFormContext } from 'react-hook-form';
import { CreateAppointmentQueueFormValues } from '@/services/client/appointment/queue/queue.types';
import { useSession } from '@/libs/providers/session-provider';
import { formatDate } from 'date-fns';

export default function AppointmentQueueReceipt() {
  const form = useFormContext<CreateAppointmentQueueFormValues>();
  const { user } = useSession();
  const appointmentId = form.watch('appointment.aid');

  const { data: appointment, isLoading: isAppointmentLoading } =
    useAppointmentQueueByAid(appointmentId);

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
        <ModalHeader className="border-divider flex-col items-center border-b">
          <Icon
            className="text-success-500 mb-3"
            icon="solar:check-circle-bold-duotone"
            width={56}
          />
          <p className="mb-2 text-base font-medium">Appointment Booked</p>
          <p className="text-default-500 text-small text-center font-normal">
            We sent a confirmation email to the patient and the doctor.
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="text-small flex w-full items-center justify-between">
              <p className="text-default-500 text-tiny">Token Number</p>
              <p className="font-medium">{appointment?.sequenceNumber}</p>
            </div>
            <div className="text-small flex w-full items-center justify-between">
              <p className="text-default-500 text-tiny">Appointment ID</p>
              <AppointmentNumber aid={appointment?.aid ?? ''} />
            </div>
            <div className="text-small flex w-full items-center justify-between">
              <p className="text-default-500 text-tiny">Patient Name</p>
              <p className="font-medium">{appointment?.patient?.name}</p>
            </div>
            <div className="text-small flex w-full items-center justify-between">
              <p className="text-default-500 text-tiny">Doctor</p>
              <p className="font-medium">{appointment?.doctor?.name}</p>
            </div>
            <div className="text-small flex w-full items-center justify-between">
              <p className="text-default-500 text-tiny">Appointment Date</p>
              <p className="font-medium">
                {formatDate(new Date(appointment?.appointmentDate || ''), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <div className="text-small flex w-full items-center justify-between">
              <p className="text-default-500 text-tiny">Payment Mode</p>
              <p className="font-medium">{appointment?.paymentMode}</p>
            </div>
            <div className="text-small flex w-full items-center justify-between">
              <p className="text-default-500 text-tiny">Booked On</p>
              <p className="font-medium">
                {formatDate(new Date(appointment?.createdAt || ''), 'MMMM d, yyyy hh:mm a')}
              </p>
            </div>
          </div>
          <Divider className="bg-default-100 w-full" />
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
        <ModalFooter className="border-divider border-t">
          <Button
            fullWidth
            variant="bordered"
            startContent={<Icon icon="solar:cloud-download-bold-duotone" width={18} />}
            isLoading={isDownloadReceiptPending}
            onPress={() => {
              downloadReceipt(appointmentId ?? '');
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

function AppointmentNumber({ aid }: { aid: string }) {
  return (
    <p className="border-primary-500 border-b border-dashed font-medium uppercase">
      <span>{aid.slice(0, 6)}</span>
      <span className="text-primary-500">{aid.slice(6, 10)}</span>
    </p>
  );
}
