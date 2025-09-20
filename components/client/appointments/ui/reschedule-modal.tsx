import { useState } from 'react';
import { useSession } from '@/providers/session-provider';
import { addToast } from '@heroui/react';
import { format } from 'date-fns';
import { CalendarDate, getLocalTimeZone, Time } from '@internationalized/date';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import DateTimePicker from '@/components/ui/date-time-picker';
import Modal from '@/components/ui/modal';
import { apiRequest } from '@/lib/axios';
import { TIMINGS } from '@/lib/config';
import { useAppointmentStore } from '@/store/appointment';

export default function RescheduleAppointment() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const { setAction, appointment } = useAppointmentStore();

  const [timing, setTiming] = useState<Date>(() => {
    if (appointment?.date) {
      return new Date(appointment.date);
    }
    const date = new Date(new Date().toLocaleString('en-US', { timeZone: getLocalTimeZone() }));
    if (date.getHours() >= 17) {
      date.setHours(9);
      date.setMinutes(0);
    } else {
      date.setMinutes(date.getMinutes() + 5);
    }
    return date;
  });

  const rescheduleMutation = useMutation({
    mutationFn: async () =>
      apiRequest({
        url: `/appointments/${appointment?.aid}`,
        method: 'PATCH',
        data: {
          status: user?.role === 'patient' ? 'booked' : 'confirmed',
          date: timing,
        },
      }),
    onSuccess: async () => {
      addToast({
        title: `Appointment rescheduled to ${format(timing, 'PPp')}`,
        description: 'Appointment rescheduled successfully',
        color: 'success',
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['appointments'] }),
        queryClient.invalidateQueries({
          queryKey: ['activity', 'appointment', appointment?.aid],
        }),
      ]);
      setAction(null);
    },
    onError: (error) => {
      addToast({
        title: 'Error rescheduling appointment',
        description: error.message,
        color: 'danger',
      });
    },
  });

  return (
    <Modal
      header="Reschedule Appointment"
      body={
        <DateTimePicker
          date={new CalendarDate(timing.getFullYear(), timing.getMonth() + 1, timing.getDate())}
          time={new Time(timing.getHours(), timing.getMinutes())}
          onDateChange={(date) => {
            // set the date to the selected date
            setTiming(
              new Date(date.year, date.month - 1, date.day, timing.getHours(), timing.getMinutes())
            );
          }}
          onTimeChange={(time) => {
            // set the time to the selected time
            setTiming(
              new Date(
                timing.getFullYear(),
                timing.getMonth(),
                timing.getDate(),
                time.hour,
                time.minute
              )
            );
          }}
          timeProps={{
            minValue: new Time(TIMINGS.appointment.start),
            maxValue: new Time(TIMINGS.appointment.end),
          }}
        />
      }
      onClose={() => setAction(null)}
      primaryButton={{
        children: 'Reschedule',
        whileSubmitting: 'Rescheduling...',
        color: 'warning',
        onPress: async () => {
          await rescheduleMutation.mutateAsync();
        },
      }}
      secondaryButton={{
        children: 'Cancel',
        onPress: () => {
          setAction(null);
        },
      }}
    />
  );
}
