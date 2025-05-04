'use client';
import axios from 'axios';
import { format } from 'date-fns';
import {
  addToast,
  Alert,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import AsyncButton from '@/components/ui/buttons/async-button';
import { Title } from '../typography/modal';
import { AppointmentType } from '@/models/Appointment';

export default function CancelModal({
  appointment,
  onClose,
  type = 'cancel',
}: {
  appointment: AppointmentType;
  onClose: () => void;
  type?: 'cancel' | 'delete';
}) {
  const handleSubmit = async () => {
    if (type === 'cancel') {
      await axios
        .patch(`/api/v1/appointments/${appointment.aid}`, {
          status: 'cancelled',
        })
        .then(() => {
          addToast({
            title: 'Appointment cancelled',
            description: 'The appointment has been cancelled',
            color: 'success',
          });
          onClose();
        })
        .catch((error) => {
          addToast({
            title: 'Error cancelling appointment',
            description: error.response.data.message,
            color: 'danger',
          });
        });
    }
    if (type === 'delete') {
      await axios
        .delete(`/api/v1/appointments/${appointment.aid}`)
        .then(() => {
          addToast({
            title: 'Appointment deleted',
            description: 'The appointment has been deleted',
            color: 'success',
          });
          onClose();
        })
        .catch((error) => {
          addToast({
            title: 'Error deleting appointment',
            description: error.response.data.message,
            color: 'danger',
          });
        });
    }
  };
  return (
    <>
      <Modal isOpen backdrop="blur" hideCloseButton>
        <ModalContent>
          <>
            <ModalHeader className="items-center justify-between">
              <Title
                title={`${type === 'cancel' ? 'Cancel' : 'Delete'} Appointment?`}
              />
              <Button variant="light" isIconOnly size="sm">
                <Icon icon="entypo:dots-two-vertical" width={18} />
              </Button>
            </ModalHeader>
            <ModalBody className="items-center">
              <Alert
                color="danger"
                title="Are you sure? This can't be undone."
              />
              <Card className="w-full border border-divider bg-default-50 shadow-none">
                <CardBody className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-medium bg-orange-100 p-2 text-orange-500">
                      <Icon icon="solar:hashtag-circle-bold" width="24" />
                    </div>
                    <div className="flex text-[15px] text-default-400">
                      <span className="capitalize">{appointment.aid}</span>
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-medium bg-blue-100 p-2 text-blue-500">
                      <Icon icon="solar:user-bold" width="24" />
                    </div>
                    <div className="flex gap-2 text-[15px] text-default-400">
                      <span className="capitalize">
                        {appointment.patient?.name}
                      </span>
                      {appointment.doctor && (
                        <span>with {appointment.doctor?.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-medium bg-primary-100 p-2 text-primary">
                      <Icon icon="solar:clock-circle-bold" width={24} />
                    </div>
                    <div className="flex text-[15px] text-default-400">
                      <span>
                        {format(
                          new Date(appointment.date as string),
                          'hh:mm a'
                        )}
                      </span>
                      <Icon icon="mdi:dot" width="24" height="24" />
                      <span>
                        {format(new Date(appointment.date as string), 'PP')}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter className="flex-col-reverse justify-center gap-2 sm:flex-row sm:gap-4">
              <Button
                radius="lg"
                variant="flat"
                className="min-w-[50%] p-6 font-medium"
                onPress={onClose}
              >
                Keep
              </Button>
              <AsyncButton
                radius="lg"
                variant="flat"
                className="min-w-[50%] p-6 font-medium"
                color="danger"
                whileSubmitting="Cancelling..."
                fn={handleSubmit}
              >
                Confirm {type === 'cancel' ? 'Cancellation' : 'Deletion'}
              </AsyncButton>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
