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

import { CreateAppointmentFormValues } from '../types';
import { useCreateAppointmentForm } from '../index';

import Skeleton from '@/components/ui/skeleton';
import { useUserWithUID } from '@/services/common/user/query';
import { useDoctorByUID } from '@/services/client/doctor/query';

export default function AppointmentBookingConfirmation() {
  const { watch, setValue, handleSubmit, formState, onSubmit } = useCreateAppointmentForm();
  const appointment = watch('appointment');
  const { isSubmitting } = formState;

  const { data: patient, isLoading: isPatientLoading } = useUserWithUID(appointment.patientId);
  const { data: doctor, isLoading: isDoctorLoading } = useDoctorByUID(appointment.doctorId);

  return (
    <Modal
      isOpen
      backdrop="blur"
      scrollBehavior="inside"
      onOpenChange={() => setValue('meta.showConfirmation', false)}
    >
      <ModalContent>
        <ModalHeader className="flex-col items-center border-b border-divider">
          <Icon
            className="mb-3 text-warning-500"
            icon="solar:info-circle-bold-duotone"
            width={56}
          />
          <p className="mb-2 text-base font-medium">Schedule this Appointment?</p>
          <p className="text-center font-normal text-default-500 text-small">
            Please review the details below before confirming your appointment.
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full flex-col text-small">
              <p className="text-default-500 text-tiny">Patient Name</p>
              {isPatientLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <p className="font-medium">{patient?.name}</p>
              )}
            </div>
            <div className="flex w-full flex-col text-small">
              <p className="text-default-500 text-tiny">When</p>
              <p className="font-medium">
                {format(appointment.date, 'EEEE, MMMM d, yyyy')} -{' '}
                {format(appointment.date, 'h:mm a')}
              </p>
            </div>
            {!!appointment.doctorId && (
              <div className="flex w-full flex-col text-small">
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
            <div className="flex w-full flex-col text-small">
              <p className="text-default-500 text-tiny">Where</p>
              <Link className="flex w-fit items-center gap-1 text-foreground" size="sm">
                <p className="font-medium">Google Meet</p>
                <Icon className="text-default-500" icon="mdi:open-in-new" width={14} />
              </Link>
            </div>
            {!!appointment.additionalInfo?.symptoms && (
              <div className="flex w-full flex-col text-small">
                <p className="text-default-500 text-tiny">Symptoms</p>
                <p className="font-medium">{appointment.additionalInfo?.symptoms}</p>
              </div>
            )}
            {!!appointment.additionalInfo?.notes && (
              <div className="flex w-full flex-col text-small">
                <p className="text-default-500 text-tiny">Additional notes</p>
                <p className="font-medium">{appointment.additionalInfo?.notes}</p>
              </div>
            )}
            {!!appointment.type && (
              <div className="flex w-full flex-col text-small">
                <p className="text-default-500 text-tiny">Appointment Type</p>
                <p className="font-medium capitalize">{appointment.type}</p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-divider">
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
