import Modal from '@/components/ui/modal';
import { useAppointmentData, useAppointmentStore } from '../store';
import { apiRequest } from '@/lib/axios';
import { format } from 'date-fns';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';

export default function CancelAppointment() {
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

  return (
    <Modal
      header="Cancel Appointment?"
      alert={{
        title: 'Are you sure? You want to cancel this appointment.',
        color: 'danger',
      }}
      body={body}
      onClose={() => setAction(null)}
      primaryButton={{
        children: 'Confirm Cancellation',
        whileSubmitting: 'Cancelling...',
        color: 'danger',
        onPress: async () => {
          await apiRequest({
            url: `/api/v1/appointments/${appointment?.aid}`,
            method: 'PATCH',
            data: {
              status: 'cancelled',
            },
            showToast: true,
            successMessage: {
              title: `Appointment cancelled`,
            },
            onSuccess: (res) => {
              refetch();
              setAction(null);
              setSelected(res);
            },
            errorMessage: {
              title: 'Error Cancelling Appointment',
            },
          });
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
