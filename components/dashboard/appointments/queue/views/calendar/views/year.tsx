'use client';

import React, { memo, useMemo } from 'react';
import { Card, CardBody, CardHeader, ScrollShadow, Tooltip } from '@heroui/react';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';

import { weekdays } from '../data';
import AppointmentList from '../ui/appointment-list';

import { cn } from '@heroui/react';
import { useAppointmentStore } from '@/services/client/appointment/appointment.store';
import { AppointmentQueue } from '@repo/store';

interface YearViewProps {
  appointments: AppointmentQueue[];
  currentDate: Date;
}

const colorDensityMap: Record<number, string> = {
  1: 'bg-success-200',
  2: 'bg-success-300',
  3: 'bg-success-400',
  4: 'bg-success-500',
  5: 'bg-success-600',
  6: 'bg-success-700',
  7: 'bg-success-800',
};

// Memoized day cell component
const DayCell = memo(
  ({
    day,
    isCurrentMonth,
    appointmentCount,
    hasAppointments,
    dayAppointments,
  }: {
    day: Date;
    isCurrentMonth: boolean;
    appointmentCount: number;
    hasAppointments: boolean;
    dayAppointments: AppointmentQueue[];
  }) => {
    const { setIsTooltipOpen } = useAppointmentStore();
    const isDayToday = isToday(day);

    return (
      <Tooltip
        content={<AppointmentList appointments={dayAppointments} date={day} />}
        onOpenChange={setIsTooltipOpen}
        delay={1000}
      >
        <div
          key={day.toISOString()}
          className={cn(
            'relative flex aspect-square size-7 cursor-pointer items-center justify-center rounded-sm text-xs transition-colors',
            {
              'text-default-400': !isCurrentMonth,
              'text-white': hasAppointments && isCurrentMonth,
              [colorDensityMap[appointmentCount]]: hasAppointments && isCurrentMonth,
              'hover:bg-default-100': !hasAppointments,
              'bg-secondary text-secondary-foreground hover:bg-secondary-300':
                isDayToday && isCurrentMonth,
            }
          )}
        >
          <span className="relative z-10">{format(day, 'd')}</span>
        </div>
      </Tooltip>
    );
  }
);

DayCell.displayName = 'DayCell';

// Memoized month calendar component
const MonthCalendar = memo(
  ({
    month,
    appointmentsByDate,
  }: {
    month: Date;
    appointmentsByDate: Map<string, AppointmentQueue[]>;
  }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    // Calculate days only once
    const days = useMemo(
      () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
      [calendarStart, calendarEnd]
    );

    return (
      <Card className="w-fit shadow-none" radius="sm">
        {/* Month header */}
        <CardHeader className="p-2">{format(month, 'MMMM')}</CardHeader>
        <CardBody className="aspect-square gap-2 overflow-visible p-2">
          <div className="grid grid-cols-7 gap-1">
            {weekdays.map((day) => (
              <div
                key={day.value}
                className="text-default-500 flex h-6 items-center justify-center text-xs font-medium"
              >
                {day.label}
              </div>
            ))}
          </div>

          {/* Calendar days grid */}
          <div className="grid grid-cols-7 grid-rows-5 gap-1 overflow-visible">
            {days.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayAppointments = appointmentsByDate.get(dateKey) || [];
              const isCurrentMonth = isSameMonth(day, month);
              const hasAppointments = dayAppointments.length > 0;
              const appointmentCount = Math.min(dayAppointments.length, 7);

              return (
                <DayCell
                  key={dateKey}
                  day={day}
                  isCurrentMonth={isCurrentMonth}
                  appointmentCount={appointmentCount}
                  hasAppointments={hasAppointments}
                  dayAppointments={dayAppointments}
                />
              );
            })}
          </div>
        </CardBody>
      </Card>
    );
  }
);

MonthCalendar.displayName = 'MonthCalendar';

export function YearView({ appointments, currentDate }: YearViewProps) {
  // Create a map of appointments by date for faster lookups
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, AppointmentQueue[]>();

    appointments.forEach((apt) => {
      const date = new Date(apt.appointmentDate ?? '');
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }

      map.get(dateKey)?.push(apt);
    });

    return map;
  }, [appointments]);

  // Calculate months only when the year changes
  const months = useMemo(() => {
    const yearStart = startOfYear(currentDate);
    const yearEnd = endOfYear(currentDate);
    return eachMonthOfInterval({ start: yearStart, end: yearEnd });
  }, [currentDate.getFullYear()]);

  return (
    <ScrollShadow className="h-full overflow-auto p-4">
      {/* Months grid */}
      <div className="mx-auto grid w-fit auto-rows-fr grid-cols-1 place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {months.map((month) => (
          <div key={month.toISOString()}>
            <MonthCalendar month={month} appointmentsByDate={appointmentsByDate} />
          </div>
        ))}
      </div>
    </ScrollShadow>
  );
}
