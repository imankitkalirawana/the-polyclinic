import { useState } from 'react';
import { CalendarDate, getLocalTimeZone, Time } from '@internationalized/date';

import DateTimePicker from '@/components/ui/date-time-picker';
import Modal from '@/components/ui/modal';
import { TIMINGS } from '@/lib/config';
import { useAppointmentStore } from '@/store/appointment';
import { useAppointmentWithAID, useRescheduleAppointment } from '@/services/client/appointment';

export default function RescheduleAppointment() {
  const { mutateAsync: rescheduleMutation } = useRescheduleAppointment();

  const { setAction, aid } = useAppointmentStore();
  const { data: appointment } = useAppointmentWithAID(aid);

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
          await rescheduleMutation({
            aid: appointment?.aid ?? '',
            date: timing.toISOString(),
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
