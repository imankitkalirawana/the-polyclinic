'use client';

import {
  format,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isWeekend,
} from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Card,
  CardBody,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { AppointmentList } from './month';
import { AppointmentType } from '@/types/appointment';
import { TIMINGS } from '@/lib/config';

interface YearViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSlotClick: (date: Date) => void;
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

export function YearView({
  appointments,
  currentDate,
  onDateChange,
  onTimeSlotClick,
}: YearViewProps) {
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), date));
  };

  const MonthCalendar = ({ month }: { month: Date }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <Card className="w-fit" radius="sm">
        {/* Month header */}
        <CardHeader className="p-2 font-medium text-default-500">
          {format(month, 'MMMM')}
        </CardHeader>
        <CardBody className="aspect-square overflow-visible p-2">
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div
                key={day}
                className="flex h-6 items-center justify-center text-xs font-medium text-default-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days grid */}
          <div className="grid grid-cols-7 grid-rows-5 gap-1 overflow-visible">
            {days.map((day) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isCurrentMonth = isSameMonth(day, month);
              const isDayToday = isToday(day);
              const hasAppointments = dayAppointments.length > 0;
              const appointmentCount = Math.min(dayAppointments.length, 7);

              return (
                <Popover shouldCloseOnScroll={false} shouldBlockScroll>
                  <PopoverTrigger>
                    <div
                      key={day.toISOString()}
                      className={cn(
                        'relative flex aspect-square size-7 cursor-pointer items-center justify-center rounded text-xs transition-colors',
                        {
                          'text-default-400': !isCurrentMonth,
                          'hover:bg-default-100': !hasAppointments,
                          'text-white': hasAppointments,
                          [colorDensityMap[appointmentCount]]: hasAppointments,
                          'bg-secondary-500 text-secondary-foreground hover:bg-secondary-600':
                            isDayToday,
                        }
                      )}
                    >
                      <span className="relative z-10">{format(day, 'd')}</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <AppointmentList
                      appointments={dayAppointments}
                      date={day}
                    />
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="h-full overflow-auto p-4 pb-16">
      {/* Months grid */}
      <div className="mx-auto grid w-fit auto-rows-fr grid-cols-1 place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {months.map((month) => (
          <div key={month.toISOString()}>
            <MonthCalendar month={month} />
          </div>
        ))}
      </div>
    </div>
  );
}
