import Modal from '@/components/ui/modal';
import { useAppointmentData, useAppointmentStore } from '../store';
import DateTimePicker from '@/components/appointments/new/session/date-time-picker';
import { CalendarDate, getLocalTimeZone, Time } from '@internationalized/date';
import { useState } from 'react';
import { TIMINGS } from '@/lib/config';
import { apiRequest } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

export default function RescheduleModal() {
  const { data: session } = useSession();
  const {
    setAction,
    selected: appointment,
    setSelected,
  } = useAppointmentStore();
  const { refetch } = useAppointmentData();

  const [timing, setTiming] = useState<Date>(() => {
    if (appointment?.date) {
      return new Date(appointment.date);
    }
    const date = new Date(
      new Date().toLocaleString('en-US', { timeZone: getLocalTimeZone() })
    );
    if (date.getHours() >= 17) {
      date.setHours(9);
      date.setMinutes(0);
    } else {
      date.setMinutes(date.getMinutes() + 5);
    }
    return date;
  });

  return (
    <Modal
      header="Reschedule Appointment"
      body={
        <DateTimePicker
          date={
            new CalendarDate(
              timing.getFullYear(),
              timing.getMonth() + 1,
              timing.getDate()
            )
          }
          time={new Time(timing.getHours(), timing.getMinutes())}
          onDateChange={(date) => {
            // set the date to the selected date
            setTiming(
              new Date(
                date.year,
                date.month - 1,
                date.day,
                timing.getHours(),
                timing.getMinutes()
              )
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
          await apiRequest({
            url: `/api/v1/appointments/${appointment?.aid}`,
            method: 'PATCH',
            data: {
              status: session?.user?.role === 'user' ? 'booked' : 'confirmed',
              date: timing,
            },
            showToast: true,
            successMessage: {
              title: `Appointment rescheduled to ${format(timing, 'PPp')}`,
            },
            onSuccess: (res) => {
              refetch();
              setAction(null);
              setSelected(res);
            },
            errorMessage: {
              title: 'Error Rescheduling Appointment',
            },
          });
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
