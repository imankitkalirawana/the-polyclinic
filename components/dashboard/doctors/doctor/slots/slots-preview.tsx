'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, cn, Tooltip } from '@heroui/react';
import { compareAsc, format, isToday } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';
import { SlotConfig } from '@/services/client/doctor';

interface SlotsPreviewProps {
  selected?: Date;
  config: SlotConfig;
  onSlotSelect?: (date: Date) => void;
}

export function SlotsPreview({ config, onSlotSelect, selected }: SlotsPreviewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDayName = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

  const getDayNumber = (date: Date) => date.getDate();

  const getDateString = (date: Date) => date.toISOString().split('T')[0];

  const getSpecificDateAvailability = (date: Date) => {
    const dateString = getDateString(date);
    return config.availability.specificDates.find((d) => d.date === dateString);
  };

  const isDayAvailable = (date: Date) => {
    const specificDate = getSpecificDateAvailability(date);
    if (specificDate) {
      return specificDate.enabled;
    }
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return config.availability.schedule[dayName]?.enabled || false;
  };

  const generateTimeSlots = (date: Date) => {
    if (!isDayAvailable(date)) return [];

    const specificDate = getSpecificDateAvailability(date);
    let slotsToUse;

    if (specificDate) {
      slotsToUse = specificDate.slots;
    } else {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const dayConfig = config.availability.schedule[dayName];
      if (!dayConfig || !dayConfig.enabled) return [];
      slotsToUse = dayConfig.slots;
    }

    const allSlots: { start: number; duration: number }[] = [];
    const duration = Number(config.duration);

    slotsToUse.forEach((timeSlot) => {
      const [startHour, startMinute] = timeSlot.start.split(':').map(Number);
      const [endHour, endMinute] = timeSlot.end.split(':').map(Number);
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      const slotDuration = duration + config.bufferTime;

      for (let time = startTime; time < endTime; time += slotDuration) {
        if (time + duration <= endTime) {
          allSlots.push({
            start: time,
            duration,
          });
        }
      }
    });

    return allSlots;
  };

  const hasSpecificDateOverride = (date: Date) => getSpecificDateAvailability(date) !== undefined;

  const weekDays = getWeekDays();

  const timeLabels: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    if (hour === 0) {
      timeLabels.push('12 AM');
    } else if (hour < 12) {
      timeLabels.push(`${hour} AM`);
    } else if (hour === 12) {
      timeLabels.push('12 PM');
    } else {
      timeLabels.push(`${hour - 12} PM`);
    }
  }

  const hourHeight = config.duration === 15 ? 80 : 64;

  useEffect(() => {
    if (scrollRef.current) {
      const hourHeight = config.duration === 15 ? 80 : 64;
      const nineAMOffset = 9 * hourHeight;
      scrollRef.current.scrollTo({
        top: nineAMOffset,
        behavior: 'smooth',
      });
    }
  }, [config.duration, currentDate]);

  return (
    // Fix 1: Ensure the container has a defined height and proper overflow handling
    <div className="flex h-full max-h-full flex-1 flex-col overflow-hidden">
      {/* Fix 2: Make the header truly sticky with proper z-index */}
      <div className="bg-background/95 backdrop-blur-xs sticky top-0 z-20 shrink-0">
        <SlotHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <div className="border-divider grid grid-cols-8 border-b">
          <div className="border-divider text-default-500 flex h-16 items-center justify-center border-r text-xs">
            {config.timezone}
          </div>

          {weekDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="border-divider relative flex h-16 flex-col items-center justify-center border-r"
            >
              <div className="text-default-500 mb-1 text-xs">{getDayName(day)}</div>
              <div
                className={`text-lg font-medium ${
                  isToday(day)
                    ? 'bg-primary-500 text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full'
                    : ''
                }`}
              >
                {getDayNumber(day)}
              </div>
              {hasSpecificDateOverride(day) && (
                <Tooltip
                  showArrow
                  delay={500}
                  placement="left"
                  color="primary"
                  content={<div className="text-xs">Custom availability</div>}
                >
                  <div
                    className="bg-primary absolute right-1 top-1 h-2 w-2 rounded-full"
                    title="Custom availability"
                  />
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fix 3: Ensure the scrollable content takes up remaining space */}
      <div className="min-h-0 flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="grid grid-cols-8" style={{ height: `${24 * hourHeight}px` }}>
          {/* Time labels column */}
          <div className="border-divider border-r">
            {timeLabels.map((time, timeIndex) => (
              <div
                key={timeIndex}
                className="border-divider flex items-start justify-end border-b pr-2 pt-1"
                style={{ height: `${hourHeight}px` }}
              >
                <span className="text-default-500 text-xs">{time}</span>
              </div>
            ))}
          </div>

          {/* Days columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-divider relative border-r">
              {/* Hour grid lines */}
              {timeLabels.map((_, timeIndex) => (
                <div
                  key={timeIndex}
                  className="border-divider border-b"
                  style={{ height: `${hourHeight}px` }}
                />
              ))}

              {/* Available slots */}
              {isDayAvailable(day) && (
                <div className="absolute inset-0">
                  {generateTimeSlots(day).map((slot, slotIndex) => {
                    const topOffset = (slot.start / 60) * hourHeight;
                    const height = (slot.duration / 60) * hourHeight;
                    const isDayOverridden = hasSpecificDateOverride(day);

                    const date = new Date(day);
                    date.setHours(Math.floor(slot.start / 60));
                    date.setMinutes(slot.start % 60);

                    const isSelected = compareAsc(date, selected ?? new Date()) === 0;

                    return (
                      <div
                        key={slotIndex}
                        className={cn(
                          'absolute left-1 right-1 cursor-pointer rounded-sm border transition-colors hover:bg-opacity-50',
                          {
                            'border-orange-400 bg-orange-400 bg-opacity-30': isDayOverridden,
                            'border-primary-400 bg-primary-400 bg-opacity-30': !isDayOverridden,
                            'border-primary-500 bg-primary-500 hover:bg-primary-500': isSelected,
                          }
                        )}
                        style={{
                          top: `${topOffset}px`,
                          height: `${height}px`,
                        }}
                        onClick={() => {
                          onSlotSelect?.(date);
                        }}
                      >
                        <div className="p-1">
                          <Tooltip delay={500} content={format(date, 'h:mm a')}>
                            <div
                              className={cn('bg-primary-400 rounded-xs h-3 w-3', {
                                'bg-orange-400': isDayOverridden,
                                'bg-primary-100': isSelected,
                              })}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const SlotHeader = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}) => {
  const formatMonthYear = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + 6);
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });

    if (month === endMonth) {
      return `${month} ${year}`;
    } else {
      return `${month} - ${endMonth} ${year}`;
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <div className="flex items-center justify-between gap-2 p-2">
      <ButtonGroup isIconOnly variant="flat" size="sm">
        <Button onPress={() => navigateWeek('prev')}>
          <Icon icon="solar:alt-arrow-left-linear" className="h-4 w-4" />
        </Button>
        <Button onPress={() => navigateWeek('next')}>
          <Icon icon="solar:alt-arrow-right-linear" className="h-4 w-4" />
        </Button>
      </ButtonGroup>
      <div className="flex items-center gap-2">
        <Button onPress={() => setCurrentDate(new Date())} variant="flat" size="sm">
          Today
        </Button>
        <h4 className="text-default-500 text-sm">{formatMonthYear(currentDate)}</h4>
      </div>
    </div>
  );
};
