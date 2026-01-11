import React, { useMemo } from 'react';
import { ScrollShadow } from '@heroui/react';
import { format } from 'date-fns';

import CalendarTime from './calendar-time';
import {
  generateTimeSlots,
  getDateTime,
  getTimeSlot,
} from '@/components/dashboard/appointments/all/booking/helper';

const timeSlots = generateTimeSlots();

export default function CalendarTimeSelect({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const time = useMemo(() => getTimeSlot(date), [date]);

  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-r-large bg-default-50 px-4 pt-3 lg:w-[300px]">
      <div className="flex w-full justify-between">
        <p className="flex items-center text-small">
          <span className="text-default-700">{format(date, 'EEE')}</span>
          &nbsp;
          <span className="text-default-500">{format(date, 'd')}</span>
        </p>
      </div>
      <div className="flex h-full max-h-[364px] w-full">
        <ScrollShadow hideScrollBar className="flex w-full flex-col gap-2">
          {timeSlots.map((slot) => (
            <CalendarTime
              key={slot}
              slot={slot}
              time={time}
              setTime={(time) => {
                setDate(getDateTime(date, time));
              }}
            />
          ))}
        </ScrollShadow>
      </div>
    </div>
  );
}
