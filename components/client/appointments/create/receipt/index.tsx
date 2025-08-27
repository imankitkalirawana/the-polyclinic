'use client';

import React from 'react';
import {
  addToast,
  Button,
  Chip,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import { Icon } from '@iconify/react';

import { CreateAppointmentFormValues } from '../types';

import Skeleton from '@/components/ui/skeleton';
import { useDoctorWithUID } from '@/hooks/queries/client/doctor';
import { useUserWithUID } from '@/hooks/queries/client/user';

export default function AppointmentBookingReceipt() {
  const { values, resetForm } = useFormikContext<CreateAppointmentFormValues>();
  const { appointment } = values;
  const { data: patient, isLoading: isPatientLoading } = useUserWithUID(appointment.patient);
  const { data: doctor, isLoading: isDoctorLoading } = useDoctorWithUID(appointment.doctor ?? '');

  return (
    <Modal
      isOpen
      backdrop="blur"
      scrollBehavior="inside"
      onOpenChange={() => {
        resetForm();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex-col items-center border-b border-divider">
          <Icon
            className="mb-3 text-success-500"
            icon="solar:check-circle-bold-duotone"
            width={56}
          />
          <p className="mb-2 text-base font-medium">This appointment is scheduled</p>
          <p className="text-center text-small font-normal text-default-500">
            We sent a confirmation email to the patient and the doctor.
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full flex-col text-small">
              <p className="text-tiny text-default-500">Patient Name</p>
              {isPatientLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <p className="font-medium">{patient?.name}</p>
              )}
            </div>
            <div className="flex w-full flex-col text-small">
              <p className="text-tiny text-default-500">When</p>
              <p className="font-medium">
                {format(appointment.date, 'EEEE, MMMM d, yyyy')} -{' '}
                {format(appointment.date, 'h:mm a')}
              </p>
            </div>
            {!!appointment.doctor && (
              <div className="flex w-full flex-col text-small">
                <p className="text-tiny text-default-500">Doctor</p>
                {isDoctorLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span className="flex items-center gap-1">
                    <p className="font-medium">{doctor?.name}</p>
                    <Chip
                      classNames={{ base: 'px-1', content: 'text-tiny' }}
                      color="primary"
                      size="sm"
                      variant="flat"
                    >
                      {doctor?.designation}
                    </Chip>
                  </span>
                )}
              </div>
            )}
            <div className="flex w-full flex-col text-small">
              <p className="text-tiny text-default-500">Where</p>
              <Link className="flex w-fit items-center gap-1 text-foreground" size="sm">
                <p className="font-medium">Google Meet</p>
                <Icon className="text-default-500" icon="mdi:open-in-new" width={14} />
              </Link>
            </div>
            {!!appointment.additionalInfo?.symptoms && (
              <div className="flex w-full flex-col text-small">
                <p className="text-tiny text-default-500">Symptoms</p>
                <p className="font-medium">{appointment.additionalInfo?.symptoms}</p>
              </div>
            )}
            {!!appointment.additionalInfo?.notes && (
              <div className="flex w-full flex-col text-small">
                <p className="text-tiny text-default-500">Additional notes</p>
                <p className="font-medium">{appointment.additionalInfo?.notes}</p>
              </div>
            )}
            {!!appointment.type && (
              <div className="flex w-full flex-col text-small">
                <p className="text-tiny text-default-500">Appointment Type</p>
                <p className="font-medium capitalize">{appointment.type}</p>
              </div>
            )}
          </div>
          <Divider className="w-full bg-default-100" />
          <p className="text-center text-small text-default-500">
            Need to make a change?{' '}
            <Link
              className="text-small text-default-800"
              href={`/appointments/${appointment.aid}?action=reschedule`}
              size="sm"
              underline="always"
            >
              Reschedule
            </Link>{' '}
            or{' '}
            <Link
              className="text-small text-default-800"
              href={`/appointments/${appointment.aid}?action=cancel`}
              size="sm"
              underline="always"
            >
              Cancel
            </Link>
          </p>
          <Divider className="w-full bg-default-100" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-small text-default-500">Add to calendar</p>
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
            onPress={() => {
              addToast({
                title: 'Downloading receipt',
                description: 'Please wait while we download the receipt',
                color: 'success',
              });
            }}
          >
            Download Receipt
          </Button>
          <Button
            fullWidth
            variant="shadow"
            color="primary"
            as={Link}
            href={`/appointments/${appointment.aid}`}
          >
            View Appointment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
