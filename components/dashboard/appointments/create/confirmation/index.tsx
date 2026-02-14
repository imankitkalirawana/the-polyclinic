'use client';

import React from 'react';
import {
  Button,
  Chip,
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

export default function AppointmentBookingConfirmation() {
  const { watch, setValue, handleSubmit, formState, onSubmit } = useCreateAppointmentForm();
  const appointment = watch('appointment');
  const { isSubmitting } = formState;

  const { data: patient, isLoading: isPatientLoading } = useUserWithID(appointment.patientId);
  const { data: doctor, isLoading: isDoctorLoading } = useDoctorById(appointment.doctorId);

  console.log('patient', patient);

  return (
    <Modal
      isOpen
      backdrop="blur"
      scrollBehavior="inside"
      onOpenChange={() => setValue('meta.showConfirmation', false)}
    >
      <ModalContent>
        <ModalHeader className="border-divider flex-col items-center border-b">
          <Icon
            className="text-warning-500 mb-3"
            icon="solar:info-circle-bold-duotone"
            width={56}
          />
          <p className="mb-2 text-base font-medium">Schedule this Appointment?</p>
          <p className="text-default-500 text-small text-center font-normal">
            Please review the details below before confirming your appointment.
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
                {format(appointment.date, 'EEEE, MMMM d, yyyy')} -{' '}
                {format(appointment.date, 'h:mm a')}
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
        </ModalBody>
        <ModalFooter className="border-divider border-t">
          <Button
            fullWidth
            variant="bordered"
            startContent={<Icon icon="solar:pen-line-duotone" />}
            onPress={() => setValue('meta.showConfirmation', false)}
          >
            Edit
          </Button>
          <Button
            fullWidth
            variant="shadow"
            color="primary"
            onPress={() => handleSubmit(onSubmit)()}
            isLoading={isSubmitting}
          >
            Book Now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
