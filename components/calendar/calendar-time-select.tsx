import { Tab, Tabs } from '@heroui/tabs';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { useMemo, useState } from 'react';

import { DurationEnum, type TimeSlot } from './calendar';
import { TimeFormatEnum, timeFormats } from './calendar';

import CalendarTime from './calendar-time';

interface CalendarTimeSelectProps {
  weekday: string;
  day: number;
  duration: DurationEnum;
  selectedTime: string;
  onTimeChange: (time: string, selectedTimeSlotRange?: TimeSlot[]) => void;
  onConfirm: () => void;
}

export default function CalendarTimeSelect({
  weekday,
  day,
  duration,
  selectedTime,
  onTimeChange,
  onConfirm
}: CalendarTimeSelectProps) {
  const [timeFormat, setTimeFormat] = useState<TimeFormatEnum>(
    TimeFormatEnum.TwelveHour
  );

  const onTimeFormatChange = (selectedKey: React.Key) => {
    const timeFormatIndex = timeFormats.findIndex(
      (tf) => tf.key === selectedKey
    );

    if (timeFormatIndex !== -1) {
      setTimeFormat(timeFormats[timeFormatIndex].key);
      onTimeChange('');
    }
  };

  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    const totalMinutesInDay = 24 * 60;
    const intervalMinutes =
      duration === DurationEnum.FiveMinutes
        ? 5
        : duration === DurationEnum.FifteenMinutes
          ? 15
          : duration === DurationEnum.ThirtyMinutes
            ? 30
            : 60;

    for (
      let minutes = 0;
      minutes < totalMinutesInDay;
      minutes += intervalMinutes
    ) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      const value = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      if (timeFormat === TimeFormatEnum.TwelveHour) {
        const period = hours >= 12 ? 'pm' : 'am';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

        slots.push({
          value,
          label: `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
        });
      } else {
        slots.push({
          value,
          label: value
        });
      }
    }

    return slots;
  }, [timeFormat, duration]);

  return (
    <div className="flex w-full flex-col items-center gap-2 px-6 pb-6 lg:w-[220px] lg:p-0">
      <div className="flex w-full justify-between py-3">
        <p className="flex items-center text-small">
          <span className="text-default-700">{weekday}</span>
          &nbsp;
          <span className="text-default-500">{day}</span>
        </p>
        <Tabs
          classNames={{
            tab: 'h-6 py-0.5 px-1.5',
            tabList: 'p-0.5 rounded-[7px] gap-0.5',
            cursor: 'rounded-md'
          }}
          size="sm"
          onSelectionChange={onTimeFormatChange}
        >
          {timeFormats.map((timeFormat) => (
            <Tab key={timeFormat.key} title={timeFormat.label} />
          ))}
        </Tabs>
      </div>
      <div className="flex h-full max-h-[300px] w-full">
        <ScrollShadow hideScrollBar className="flex w-full flex-col gap-2">
          {timeSlots.map((slot) => (
            <CalendarTime
              key={slot.value}
              isSelected={slot.value === selectedTime}
              slot={slot}
              timeSlots={timeSlots}
              onConfirm={onConfirm}
              onTimeChange={onTimeChange}
            />
          ))}
        </ScrollShadow>
      </div>
    </div>
  );
}
