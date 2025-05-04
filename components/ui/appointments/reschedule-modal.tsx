'use client';
import { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { CalendarDate, getLocalTimeZone, Time } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';

import AsyncButton from '@/components/ui/buttons/async-button';
import { TIMINGS } from '@/lib/config';
import { AppointmentType } from '@/models/Appointment';
import { Title } from '../typography/modal';
import DateTimePicker from '@/components/appointments/new/session/date-time-picker';

export default function RescheduleModal({
  appointment,
  onClose,
}: {
  appointment: AppointmentType;
  onClose: () => void;
}) {
  const { locale } = useLocale();

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
    <>
      <Modal isOpen backdrop="blur" onClose={onClose} hideCloseButton>
        <ModalContent>
          <>
            <ModalHeader className="items-center justify-between">
              <Title title="Reschedule Appointment" />
              <Button variant="light" isIconOnly size="sm">
                <Icon icon="entypo:dots-two-vertical" width={18} />
              </Button>
            </ModalHeader>
            <ModalBody className="items-center">
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
            </ModalBody>
            <ModalFooter className="flex-col-reverse justify-center gap-2 sm:flex-row sm:gap-4">
              <Button
                radius="lg"
                variant="flat"
                className="min-w-[50%] p-6 font-medium"
                onPress={onClose}
              >
                Cancel
              </Button>
              <AsyncButton
                radius="lg"
                variant="flat"
                className="min-w-[50%] p-6 font-medium"
                color="primary"
                fn={async () => {
                  await axios
                    .post(
                      `/api/v1/appointments/${appointment?.aid}/reschedule`,
                      {
                        date: timing.toISOString(),
                      }
                    )
                    .then(() => {
                      addToast({
                        title: `Appointment Rescheduled`,
                        description: `Appointment rescheduled to ${format(
                          timing,
                          'PPp'
                        )}`,
                        color: 'success',
                      });
                      // formik.setFieldValue('selected', {
                      //   ...appointment,
                      //   date: timing.toISOString(),
                      //   status:
                      //     session?.user?.role === 'user'
                      //       ? 'booked'
                      //       : 'confirmed',
                      // });
                      // refetch();
                      // formik.setFieldValue('modal', null);
                    });
                }}
                whileSubmitting="Rescheduling..."
                isDisabled={
                  timing.getHours() < TIMINGS.appointment.start ||
                  timing.getHours() >= TIMINGS.appointment.end
                }
              >
                Reschedule
              </AsyncButton>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
