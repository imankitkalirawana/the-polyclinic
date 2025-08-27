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
import { useFormikContext } from 'formik';
import { Icon } from '@iconify/react';

import { CreateAppointmentFormValues } from '../types';

import Skeleton from '@/components/ui/skeleton';
import { useDoctorWithUID } from '@/hooks/queries/client/doctor';
import { useUserWithUID } from '@/hooks/queries/client/user';

export default function AppointmentBookingConfirmation() {
  const { values, setFieldValue, handleSubmit, isSubmitting } =
    useFormikContext<CreateAppointmentFormValues>();
  const { appointment } = values;

  const { data: patient, isLoading: isPatientLoading } = useUserWithUID(appointment.patient);
  const { data: doctor, isLoading: isDoctorLoading } = useDoctorWithUID(appointment.doctor ?? '');

  return (
    <Modal
      isOpen
      backdrop="blur"
      scrollBehavior="inside"
      onOpenChange={() => setFieldValue('meta.showConfirmation', false)}
    >
      <ModalContent>
        <ModalHeader className="flex-col items-center border-b border-divider">
          <Icon
            className="mb-3 text-warning-500"
            icon="solar:info-circle-bold-duotone"
            width={56}
          />
          <p className="mb-2 text-base font-medium">Schedule this Appointment?</p>
          <p className="text-center text-small font-normal text-default-500">
            Please review the details below before confirming your appointment.
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
        </ModalBody>
        <ModalFooter className="border-t border-divider">
          <Button
            fullWidth
            variant="bordered"
            startContent={<Icon icon="solar:pen-line-duotone" />}
            onPress={() => setFieldValue('meta.showConfirmation', false)}
          >
            Edit
          </Button>
          <Button
            fullWidth
            variant="shadow"
            color="primary"
            onPress={() => handleSubmit()}
            isLoading={isSubmitting}
          >
            Book Now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
