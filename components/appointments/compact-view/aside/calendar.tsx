import React, { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import CalendarWidget from '@/components/ui/calendar-widget';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/models/Appointment';

export enum AType {
  consultation = 'consultation',
  'follow-up' = 'follow-up',
  emergency = 'emergency',
}

const typeMap: Record<AType, string> = {
  consultation: 'bg-sky-500',
  'follow-up': 'bg-amber-500',
  emergency: 'bg-rose-500',
};

export default function Calendar({
  appointments,
}: {
  appointments: AppointmentType[];
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const appointmentsByDate = appointments.reduce(
    (acc, appointment) => {
      const dateKey = format(new Date(appointment.date), 'yyyy-MM-dd');
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const firstDayOfWeek = getDay(startOfMonth(currentMonth));

  return (
    <div>
      <div className="min-w-72 bg-default-100 p-2">
        <div className="mb-4 flex items-center justify-between bg-default-100 text-default-500">
          <Button
            onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
            isIconOnly
            size="sm"
            variant="light"
            radius="lg"
          >
            <Icon
              className="text-default-500"
              icon="solar:alt-arrow-left-linear"
              width={18}
            />
          </Button>
          <h2 className="text-small font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button
            onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
            isIconOnly
            size="sm"
            variant="light"
            radius="lg"
          >
            <Icon
              className="text-default-500"
              icon="solar:alt-arrow-right-linear"
              width={18}
            />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={`${day}-${index}`} className="text-center text-sm">
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 p-2">
        {[...Array(firstDayOfWeek)].map((_, i) => (
          <div key={`empty-${i}`} className="h-10 w-10" /> // Empty spaces
        ))}
        {daysInMonth.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const appointmentCount = appointmentsByDate[dateKey] || 0;

          return (
            <Tooltip
              content={
                <CalendarWidget
                  appointments={appointments.filter(
                    (a) => format(new Date(a.date), 'yyyy-MM-dd') === dateKey
                  )}
                />
              }
              isDisabled={appointmentCount === 0}
              key={dateKey}
              delay={500}
              placement="left"
              classNames={{
                base: 'bg-transparent p-0',
              }}
              className="bg-transparent p-0"
              shadow="none"
            >
              <div
                className={cn(
                  'relative flex h-10 w-10 cursor-default items-center justify-center rounded-medium backdrop-blur-sm',
                  {
                    'bg-primary-500/20 font-medium text-primary':
                      format(day, 'yyyy-MM-dd') ===
                      format(new Date(), 'yyyy-MM-dd'),
                  }
                )}
              >
                {format(day, 'd')}
                <div className="absolute bottom-1.5 flex gap-0.5">
                  {appointmentCount > 0 &&
                    [...Array(Math.min(appointmentCount, 3))].map((_, i) => (
                      <span
                        key={i}
                        className={cn('h-1 w-1 rounded-full', {
                          [typeMap[appointments[i].type]]: true,
                        })}
                      />
                    ))}
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
