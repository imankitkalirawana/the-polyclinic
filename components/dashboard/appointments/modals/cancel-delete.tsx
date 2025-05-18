import Modal from '@/components/ui/modal';
import { useAppointmentData, useAppointmentStore } from '../store';
import { apiRequest } from '@/lib/axios';
import { format } from 'date-fns';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useCallback } from 'react';

export default function CancelDeleteAppointment({
  type = 'cancel',
}: {
  type?: 'cancel' | 'delete';
}) {
  const {
    setAction,
    selected: appointment,
    setSelected,
  } = useAppointmentStore();
  const { refetch } = useAppointmentData();

  const body = React.useMemo(
    () => (
      <Card className="w-full border border-divider bg-default-50 shadow-none">
        <CardBody className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-medium bg-orange-100 p-2 text-orange-500">
              <Icon icon="solar:hashtag-circle-bold" width="24" />
            </div>
            <div className="flex text-[15px] text-default-400">
              <span className="capitalize">{appointment?.aid}</span>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
          <div className="flex items-center gap-4">
            <div className="rounded-medium bg-blue-100 p-2 text-blue-500">
              <Icon icon="solar:user-bold" width="24" />
            </div>
            <div className="flex gap-2 text-[15px] text-default-400">
              <span className="capitalize">{appointment?.patient?.name}</span>
              {appointment?.doctor && (
                <span>with {appointment?.doctor?.name}</span>
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
                {format(new Date(appointment?.date as string), 'hh:mm a')}
              </span>
              <Icon icon="mdi:dot" width="24" height="24" />
              <span>{format(new Date(appointment?.date as string), 'PP')}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    ),
    [appointment]
  );

  const handleSubmit = useCallback(async () => {
    await apiRequest({
      url: `/api/v1/appointments/${appointment?.aid}`,
      method: type === 'cancel' ? 'PATCH' : 'DELETE',
      data: {
        status: type === 'cancel' ? 'cancelled' : 'deleted',
      },
      showToast: true,
      successMessage: {
        description:
          type === 'cancel' ? 'Appointment cancelled' : 'Appointment deleted',
      },
      onSuccess: (data) => {
        refetch();
        setAction(null);
        if (type === 'delete') {
          setSelected(null);
        } else {
          setSelected(data);
        }
      },
      errorMessage: {
        title:
          type === 'cancel'
            ? 'Error cancelling appointment'
            : 'Error deleting appointment',
      },
    });
  }, [appointment?.aid, type]);

  return (
    <Modal
      header={type === 'cancel' ? 'Cancel Appointment?' : 'Delete Appointment?'}
      alert={{
        title:
          type === 'cancel'
            ? 'Are you sure? You want to cancel this appointment.'
            : 'Are you sure? This action cannot be undone.',
        color: 'danger',
      }}
      body={body}
      onClose={() => setAction(null)}
      primaryButton={{
        children:
          type === 'cancel' ? 'Confirm Cancellation' : 'Confirm Deletion',
        whileSubmitting: type === 'cancel' ? 'Cancelling...' : 'Deleting...',
        color: 'danger',
        onPress: async () => {
          await handleSubmit();
        },
      }}
      secondaryButton={{
        children: 'Keep',
        onPress: () => {
          setAction(null);
        },
      }}
    />
  );
}
