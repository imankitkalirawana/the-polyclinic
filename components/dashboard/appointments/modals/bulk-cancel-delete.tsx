import Modal from '@/components/ui/modal';
import { useAppointmentData, useAppointmentStore } from '../store';
import { apiRequest } from '@/lib/axios';
import { format } from 'date-fns';
import { addToast, Card, CardBody, ScrollShadow, User } from '@heroui/react';
import React, { useCallback, useMemo } from 'react';
import { AppointmentType } from '@/models/Appointment';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CancelDeleteAppointments({
  appointments,
  type = 'cancel',
}: {
  appointments: Array<AppointmentType>;
  type?: 'cancel' | 'delete';
}) {
  const { setAction, setKeys } = useAppointmentStore();
  const queryClient = useQueryClient();

  const body = React.useMemo(
    () => (
      <Card className="w-full border border-divider bg-default-50 shadow-none">
        <CardBody
          as={ScrollShadow}
          className="flex max-h-[300px] flex-col gap-2 scrollbar-hide"
        >
          {appointments.map((appointment) => {
            return (
              <div className="flex items-center justify-between gap-4">
                <User
                  name={appointment.patient.name}
                  avatarProps={{
                    src: appointment.patient.image,
                    size: 'sm',
                    name: appointment.patient.name,
                  }}
                  classNames={{
                    description: 'text-default-400 text-tiny',
                  }}
                  description={`#${appointment.aid} - ${format(new Date(appointment.date), 'PP')}`}
                />
                {renderChip({ item: appointment.status })}
              </div>
            );
          })}
        </CardBody>
      </Card>
    ),
    [appointments]
  );

  const ids = useMemo(() => {
    return appointments.map((appointment) => appointment.aid);
  }, [appointments, type]);

  const cancelDeleteMutation = useMutation({
    mutationFn: async () =>
      apiRequest({
        url: '/api/v1/appointments',
        method: type === 'cancel' ? 'PATCH' : 'DELETE',
        data: {
          ids,
        },
        successMessage: {
          title: `${ids.length} Appointment${ids.length <= 1 ? '' : 's'} ${type === 'cancel' ? 'cancelled' : 'deleted'}`,
        },
      }),
    onSuccess: async () => {
      addToast({
        title: `${ids.length} Appointment${ids.length <= 1 ? '' : 's'} ${type === 'cancel' ? 'cancelled' : 'deleted'}`,
        description: 'Appointments cancelled successfully',
        color: 'success',
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['appointments'] }),
        queryClient.invalidateQueries({
          queryKey: ['activity', 'appointment'],
        }),
      ]);
      setAction(null);
      setKeys(new Set());
    },
    onError: (error) => {
      addToast({
        title: 'Error cancelling appointments',
        description: error.message,
        color: 'danger',
      });
    },
  });

  return (
    <Modal
      header={`${type === 'cancel' ? 'Cancel' : 'Delete'} Appointments?`}
      alert={{
        title: `Are you sure? You want to ${type === 'cancel' ? 'cancel' : 'delete'} these appointments.`,
        color: 'danger',
      }}
      body={body}
      onClose={() => setAction(null)}
      primaryButton={{
        children: `Confirm ${type === 'cancel' ? 'Cancellation' : 'Deletion'}`,
        whileSubmitting: type === 'cancel' ? 'Cancelling...' : 'Deleting...',
        color: 'danger',
        onPress: async () => {
          await cancelDeleteMutation.mutateAsync();
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
