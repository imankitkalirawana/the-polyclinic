'use client';

import { useState } from 'react';
import type { SlotConfig } from '@/types/slots';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { isToday } from 'date-fns';

interface CalendarPreviewProps {
  config: SlotConfig;
}

export function CalendarPreview({ config }: CalendarPreviewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getSpecificDateAvailability = (date: Date) => {
    const dateString = getDateString(date);
    return config.availability.specificDates.find((d) => d.date === dateString);
  };

  const isDayAvailable = (date: Date) => {
    // Check if there's a specific date override
    const specificDate = getSpecificDateAvailability(date);
    if (specificDate) {
      return specificDate.enabled;
    }

    // Fall back to weekly schedule
    const dayName = date
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();
    return config.availability.schedule[dayName]?.enabled || false;
  };

  const generateTimeSlots = (date: Date) => {
    if (!isDayAvailable(date)) return [];

    // Check if there's a specific date override
    const specificDate = getSpecificDateAvailability(date);
    let slotsToUse;

    if (specificDate) {
      slotsToUse = specificDate.slots;
    } else {
      // Use weekly schedule

      const dayName = date
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();
      const dayConfig = config.availability.schedule[dayName];

      if (!dayConfig || !dayConfig.enabled) return [];
      slotsToUse = dayConfig.slots;
    }

    const allSlots: { start: number; duration: number }[] = [];

    const duration = Number(config.duration);

    // Process each time slot for the day
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

  const hasSpecificDateOverride = (date: Date) => {
    return getSpecificDateAvailability(date) !== undefined;
  };

  const weekDays = getWeekDays();
  const timeLabels: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeLabels.push(
      `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`
    );
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <div className="h-full flex-1 overflow-y-auto">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onPress={() => navigateWeek('prev')}
          className="p-1 text-default-400"
        >
          <Icon icon="mdi:chevron-left" className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => navigateWeek('next')}
          className="p-1 text-default-400"
        >
          <Icon icon="mdi:chevron-right" className="h-4 w-4" />
        </Button>
      </div>
      {/* Calendar Grid */}
      <div className="flex-1">
        <div className="grid min-h-full grid-cols-8">
          {/* Time column */}
          <div className="border-r border-divider">
            <div className="flex h-16 items-center justify-center border-b border-divider text-xs text-default-500">
              {config.timezone}
            </div>
            {timeLabels.map((time) => (
              <div
                key={time}
                className="flex h-16 items-start justify-end border-b border-divider pr-2 pt-1"
              >
                <span className="text-xs text-default-500">{time}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-divider">
              {/* Day header */}
              <div className="relative flex h-16 flex-col items-center justify-center border-b border-divider">
                <div className="mb-1 text-xs text-default-500">
                  {getDayName(day)}
                </div>
                <div
                  className={`text-lg font-medium ${
                    isToday(day)
                      ? 'flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-primary-foreground'
                      : ''
                  }`}
                >
                  {getDayNumber(day)}
                </div>
                {/* Indicator for specific date override */}
                {hasSpecificDateOverride(day) && (
                  <div
                    className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-400"
                    title="Custom availability"
                  />
                )}
              </div>

              {/* Time slots */}
              <div className="relative h-full overflow-auto">
                {timeLabels.map((_, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="h-16 border-b border-divider"
                  ></div>
                ))}

                {/* Available slots overlay */}
                {isDayAvailable(day) && (
                  <div className="absolute inset-0">
                    {generateTimeSlots(day).map((slot, slotIndex) => {
                      const topOffset = ((slot.start - 480) / 60) * 64; // 480 = 8 AM in minutes, 64px per hour
                      const height = (slot.duration / 60) * 64;

                      const isDayOverridden = hasSpecificDateOverride(day);

                      return (
                        <div
                          key={slotIndex}
                          className={`absolute left-1 right-1 cursor-pointer rounded border transition-colors hover:bg-opacity-50 ${
                            isDayOverridden
                              ? 'border-orange-400 bg-orange-400 bg-opacity-30'
                              : 'border-primary-400 bg-primary-400 bg-opacity-30'
                          }`}
                          style={{
                            top: `${topOffset}px`,
                            height: `${height}px`,
                          }}
                        >
                          <div className="p-1">
                            <div
                              className={`h-3 w-3 rounded-sm ${
                                isDayOverridden
                                  ? 'bg-orange-400'
                                  : 'bg-primary-400'
                              }`}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
