import { useState } from 'react';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

import Modal from '@/components/ui/modal';
import { useAppointmentStore } from '@/services/client/appointment/appointment.store';
import { useAppointmentWithAID, useRescheduleAppointment } from '@/services/client/appointment';
import { useSession } from '@/libs/providers/session-provider';
import { useSlotsByUID } from '@/services/client/doctor';
import { SlotsPreview } from '@/components/dashboard/doctors/doctor/slots/slots-preview';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';
import { Calendar } from '@heroui/react';
import { TIMINGS } from '@/libs/config';
import { isDateUnavailable } from '@/components/dashboard/appointments/create/helpers';
import { useLocale } from '@react-aria/i18n';
import CalendarTimeSelect from '@/components/dashboard/appointments/all/booking/calendar-time-select';
import { isPast } from 'date-fns';

export default function RescheduleAppointment() {
  const { mutateAsync: rescheduleMutation } = useRescheduleAppointment();
  const { user } = useSession();
  const { locale } = useLocale();

  const { setAction, aid } = useAppointmentStore();
  const { data: appointment } = useAppointmentWithAID(aid);

  const [date, setDate] = useState<Date>(new Date(appointment?.date ?? ''));

  const renderBody = () => {
    if (appointment?.doctor?.uid) {
      return (
        <SlotContent
          doctorId={appointment.doctor.uid}
          selectedDate={date}
          onDateSelect={(date) => setDate(date)}
        />
      );
    }

    return (
      <div className="flex justify-center">
        <Calendar
          aria-label="Appointment Date"
          minValue={today(getLocalTimeZone())}
          maxValue={today(getLocalTimeZone()).add({
            days: TIMINGS.booking.maximum,
          })}
          value={new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())}
          onChange={(selectedDate: CalendarDate) => {
            // Preserve the current time when changing the date
            const newDate = new Date(
              selectedDate.year,
              selectedDate.month - 1,
              selectedDate.day,
              date.getHours(),
              date.getMinutes()
            );
            setDate(newDate);
          }}
          showHelper
          isDateUnavailable={(date) => isDateUnavailable(date, locale)}
          calendarWidth="372px"
          className="rounded-r-none shadow-none"
          classNames={{
            headerWrapper: 'bg-transparent px-3 pt-1.5 pb-3',
            title: 'text-default-700 text-small font-semibold',
            gridHeader: 'bg-transparent shadow-none',
            gridHeaderCell: 'font-medium text-default-400 text-xs p-0 w-full',
            gridHeaderRow: 'px-3 pb-3',
            gridBodyRow: 'gap-x-1 px-3 mb-1 first:mt-4 last:mb-0',
            gridWrapper: 'pb-3',
            cell: 'p-1.5 w-full',
            cellButton:
              'w-full h-9 rounded-medium data-selected:shadow-[0_2px_12px_0] data-[selected]:shadow-primary-300 text-small font-medium',
          }}
        />
        <CalendarTimeSelect date={date} setDate={setDate} />
      </div>
    );
  };

  return (
    <Modal
      isOpen
      size={appointment?.doctor?.uid ? '5xl' : '3xl'}
      title="Reschedule Appointment"
      subtitle={
        user?.role === 'PATIENT'
          ? 'Request a new appointment time for your appointment'
          : 'Choose a new appointment time for the patient'
      }
      classNames={{
        body: 'bg-transparent',
      }}
      body={renderBody()}
      onClose={() => setAction(null)}
      submitButton={{
        children: 'Reschedule',
        whileSubmitting: 'Rescheduling...',
        color: 'warning',
        // disabled if date is in past
        isDisabled: isPast(date),
      }}
      onSubmit={async () => {
        await rescheduleMutation({
          aid: appointment?.aid ?? '',
          date: date.toISOString(),
        });
      }}
    />
  );
}

function SlotContent({
  doctorId,
  selectedDate,
  onDateSelect,
}: {
  doctorId: string;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
}) {
  const { data: slot, isLoading: isSlotsLoading } = useSlotsByUID(doctorId);

  if (isSlotsLoading) {
    return <MinimalPlaceholder message="Loading available slots..." />;
  }

  if (!slot) {
    return (
      <MinimalPlaceholder message="No slots available for this doctor" isLoading={isSlotsLoading} />
    );
  }

  return <SlotsPreview selected={selectedDate} config={slot} onSlotSelect={onDateSelect} />;
}
