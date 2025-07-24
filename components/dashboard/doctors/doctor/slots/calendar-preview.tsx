'use client';

import { useState } from 'react';
import type { AppointmentConfig } from './types';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

interface CalendarPreviewProps {
  config: AppointmentConfig;
}

export function CalendarPreview({ config }: CalendarPreviewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 20)); // July 2025

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

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

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isDayAvailable = (date: Date) => {
    const dayName = date
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();
    return config.availability.schedule[dayName]?.enabled || false;
  };

  const generateTimeSlots = (date: Date) => {
    if (!isDayAvailable(date)) return [];

    const dayName = date
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();
    const dayConfig = config.availability.schedule[dayName];

    if (!dayConfig || !dayConfig.enabled) return [];

    const allSlots = [];

    const duration = Number(config.duration);

    // Process each time slot for the day
    dayConfig.slots.forEach((timeSlot) => {
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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}${mins > 0 ? ':' + mins.toString().padStart(2, '0') : ''} ${period}`;
  };

  const weekDays = getWeekDays();
  const timeLabels = [];
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
    <div className="flex-1 bg-gray-900 text-white">
      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid min-h-full grid-cols-8">
          {/* Time column */}
          <div className="border-r border-gray-700">
            <div className="flex h-16 items-center justify-center border-b border-gray-700 text-xs text-gray-400">
              {config.timezone}
            </div>
            {timeLabels.map((time, index) => (
              <div
                key={time}
                className="flex h-16 items-start justify-end border-b border-gray-700 pr-2 pt-1"
              >
                <span className="text-xs text-gray-400">{time}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-gray-700">
              {/* Day header */}
              <div className="flex h-16 flex-col items-center justify-center border-b border-gray-700">
                <div className="mb-1 text-xs text-gray-400">
                  {getDayName(day)}
                </div>
                <div
                  className={`text-lg font-medium ${
                    isToday(day)
                      ? 'flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white'
                      : 'text-white'
                  }`}
                >
                  {getDayNumber(day)}
                </div>
              </div>

              {/* Time slots */}
              <div className="relative">
                {timeLabels.map((_, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="h-16 border-b border-gray-700"
                  ></div>
                ))}

                {/* Available slots overlay */}
                {isDayAvailable(day) && (
                  <div className="absolute inset-0">
                    {generateTimeSlots(day).map((slot, slotIndex) => {
                      const topOffset = ((slot.start - 480) / 60) * 64; // 480 = 8 AM in minutes, 64px per hour
                      const height = (slot.duration / 60) * 64;

                      return (
                        <div
                          key={slotIndex}
                          className="absolute left-1 right-1 cursor-pointer rounded border border-blue-400 bg-blue-400 bg-opacity-30 transition-colors hover:bg-opacity-50"
                          style={{
                            top: `${topOffset}px`,
                            height: `${height}px`,
                          }}
                        >
                          <div className="p-1">
                            <div className="h-3 w-3 rounded-sm bg-blue-400"></div>
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
