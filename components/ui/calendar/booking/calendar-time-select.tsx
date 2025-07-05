import { ScrollShadow } from '@heroui/react';

import CalendarTime from './calendar-time';
import { format } from 'date-fns';
import {
  generateTimeSlots,
  getDateTime,
  getTimeSlot,
  isDateUnavailable,
} from '@/components/appointments/create/helper';
import { useMemo } from 'react';
import { useLocale } from '@react-aria/i18n';
import { parseDate } from '@internationalized/date';

const timeSlots = generateTimeSlots();

export default function CalendarTimeSelect({
  onConfirm,
  date,
  setDate,
}: {
  onConfirm: () => void;
  date: Date;
  setDate: (date: Date) => void;
}) {
  const { locale } = useLocale();
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
      <div className="flex h-full max-h-[300px] w-full">
        <ScrollShadow hideScrollBar className="flex w-full flex-col gap-2">
          {timeSlots.map((slot) => (
            <CalendarTime
              key={slot}
              slot={slot}
              onConfirm={onConfirm}
              time={time}
              setTime={(time) => {
                setDate(getDateTime(date, time));
              }}
              isDisabled={isDateUnavailable(
                parseDate(format(date, 'yyyy-MM-dd')),
                locale
              )}
            />
          ))}
        </ScrollShadow>
      </div>
    </div>
  );
}
