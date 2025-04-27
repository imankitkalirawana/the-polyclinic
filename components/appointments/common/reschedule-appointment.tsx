'use client';
import { useState } from 'react';
import React from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@heroui/react';
import { CalendarDate, getLocalTimeZone, Time } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

import DateTimePicker from '../new/session/date-time-picker';

import { rescheduleAppointment } from '@/functions/server-actions/appointment';
import { TIMINGS } from '@/lib/config';
import { AppointmentType } from '@/models/Appointment';

export default function RescheduleAppointment({
  appointment,
  modal,
  setAppointments,
}: {
  appointment: AppointmentType;
  modal: any;
  setAppointments: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useLocale();

  //   new here

  const [timing, setTiming] = useState<Date>(() => {
    if (appointment.date) {
      return new Date(appointment.date);
    }
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: getLocalTimeZone() })
    );
  });

  return (
    <>
      <ModalHeader className="flex-col items-start gap-4">
        <h2 className="mt-4 max-w-xs text-center text-base">
          Reschedule Appointment
        </h2>
        <p className="text-sm font-light">
          This appointment will be rescheduled and the patient will be notified.
        </p>
      </ModalHeader>
      <ModalBody className="flex w-full flex-col items-center justify-center py-4 lg:flex-row">
        <DateTimePicker
          date={
            new CalendarDate(
              timing.getFullYear(),
              timing.getMonth() + 1,
              timing.getDate()
            )
          }
          // @ts-ignore
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
            // @ts-ignore
            minValue: new Time(TIMINGS.appointment.start),
            // @ts-ignore
            maxValue: new Time(TIMINGS.appointment.end),
          }}
        />
      </ModalBody>
      <ModalFooter className="flex-col-reverse sm:flex-row">
        <Button
          fullWidth
          color="default"
          onPress={() => {
            modal.onClose();
          }}
          variant="bordered"
        >
          Cancel
        </Button>
        <Button
          fullWidth
          color="warning"
          isLoading={isLoading}
          onPress={async () => {
            setIsLoading(true);
            await rescheduleAppointment(appointment.aid, timing.toISOString())
              .then(() => {
                setAppointments((prev: AppointmentType[]) => {
                  const updatedAppointments = prev.map((item) => {
                    if (item._id === appointment._id) {
                      return {
                        ...item,
                        date: new Date(timing),
                        status: 'booked',
                      };
                    }
                    return item;
                  });
                  return updatedAppointments;
                });
                // remove query params
                toast(
                  `Appointment Rescheduled to ${format(new Date(timing), 'PPp')}`,
                  {
                    duration: 10000,
                  }
                );
                modal.onClose();
              })
              .catch((error) => {
                console.error(error);
                toast.error('An error occurred');
              });
          }}
        >
          Reschedule
        </Button>
      </ModalFooter>
    </>
  );
}
