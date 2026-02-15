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
import { Icon } from '@iconify/react';

import { useCreateAppointmentForm } from '../index';

import Skeleton from '@/components/ui/skeleton';
import { useUserWithID } from '@/services/common/user/user.query';
import { useDoctorById } from '@/services/client/doctor/doctor.query';

export default function AppointmentBookingReceipt() {
  const { watch, reset } = useCreateAppointmentForm();
  const appointment = watch('appointment');
  const { data: patient, isLoading: isPatientLoading } = useUserWithID(appointment.patientId);
  const { data: doctor, isLoading: isDoctorLoading } = useDoctorById(appointment.doctorId);

  return (
    <Modal
      isOpen
      backdrop="blur"
      scrollBehavior="inside"
      onOpenChange={() => {
        reset();
      }}
    >
      <ModalContent>
        <ModalHeader className="border-divider flex-col items-center border-b">
          <Icon
            className="text-success-500 mb-3"
            icon="solar:check-circle-bold-duotone"
            width={56}
          />
          <p className="mb-2 text-base font-medium">This appointment is scheduled</p>
          <p className="text-default-500 text-small text-center font-normal">
            We sent a confirmation email to the patient and the doctor.
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="text-small flex w-full flex-col">
              <p className="text-default-500 text-tiny">Patient Name</p>
              {isPatientLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <p className="font-medium">{patient?.name}</p>
              )}
            </div>
            <div className="text-small flex w-full flex-col">
              <p className="text-default-500 text-tiny">When</p>
              <p className="font-medium">
                {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')} -{' '}
                {format(new Date(appointment.date), 'h:mm a')}
              </p>
            </div>
            {!!appointment.doctorId && (
              <div className="text-small flex w-full flex-col">
                <p className="text-default-500 text-tiny">Doctor</p>
                {isDoctorLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <span className="flex items-center gap-1">
                    <p className="font-medium">{doctor?.name}</p>
                    {doctor?.designation && (
                      <Chip
                        classNames={{ base: 'px-1', content: 'text-tiny' }}
                        color="primary"
                        size="sm"
                        variant="flat"
                      >
                        {doctor?.designation}
                      </Chip>
                    )}
                  </span>
                )}
              </div>
            )}
            <div className="text-small flex w-full flex-col">
              <p className="text-default-500 text-tiny">Where</p>
              <Link className="text-foreground flex w-fit items-center gap-1" size="sm">
                <p className="font-medium">Google Meet</p>
                <Icon className="text-default-500" icon="mdi:open-in-new" width={14} />
              </Link>
            </div>
            {!!appointment.additionalInfo?.symptoms && (
              <div className="text-small flex w-full flex-col">
                <p className="text-default-500 text-tiny">Symptoms</p>
                <p className="font-medium">{appointment.additionalInfo?.symptoms}</p>
              </div>
            )}
            {!!appointment.additionalInfo?.notes && (
              <div className="text-small flex w-full flex-col">
                <p className="text-default-500 text-tiny">Additional notes</p>
                <p className="font-medium">{appointment.additionalInfo?.notes}</p>
              </div>
            )}
            {!!appointment.type && (
              <div className="text-small flex w-full flex-col">
                <p className="text-default-500 text-tiny">Appointment Type</p>
                <p className="font-medium capitalize">{appointment.type}</p>
              </div>
            )}
          </div>
          <Divider className="bg-default-100 w-full" />
          <p className="text-default-500 text-small text-center">
            Need to make a change?{' '}
            <Link
              className="text-default-800 text-small"
              // TODO: Add redirect URL here
              size="sm"
              underline="always"
            >
              Reschedule
            </Link>{' '}
            or{' '}
            <Link
              className="text-default-800 text-small"
              // TODO: Add redirect URL here
              size="sm"
              underline="always"
            >
              Cancel
            </Link>
          </p>
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
            // TODO: Add redirect URL here
          >
            View Appointment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
