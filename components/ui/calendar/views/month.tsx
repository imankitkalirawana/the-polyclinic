'use client';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/types/appointment';
import { View, views } from '../types';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  ScrollShadow,
} from '@heroui/react';
import DateChip from '../ui/date-chip';
import { formatTime } from '../helper';
import StatusRenderer from '../ui/status-renderer';
import AppointmentPopover from '../ui/appointment-popover';
import { useState } from 'react';
import { TIMINGS } from '@/lib/config';
import { parseAsStringEnum, useQueryState } from 'nuqs';

interface MonthViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
}

const MAX_APPOINTMENTS_PER_DAY = 2;
const POPOVER_DELAY = 200;
const TIME_INTERVAL = 15;

export function MonthView({
  appointments,
  currentDate,
  onTimeSlotClick,
}: MonthViewProps) {
  const [_view, setView] = useQueryState('view', parseAsStringEnum(views));
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const numberOfWeeks = Math.ceil(days.length / 7);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), date));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Week header */}
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day}
            className={cn(
              'border-r text-center text-tiny font-medium uppercase text-default-500 last:border-r-0'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="grid h-full flex-1 grid-cols-7"
        style={{
          gridTemplateRows: `repeat(${numberOfWeeks}, minmax(100px, 1fr))`,
        }}
      >
        {days.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const maxAppointmentsToShow =
            dayAppointments.length > MAX_APPOINTMENTS_PER_DAY + 1
              ? MAX_APPOINTMENTS_PER_DAY
              : MAX_APPOINTMENTS_PER_DAY + 1;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'flex select-none flex-col justify-start border-b border-r p-1 last:border-r-0',
                !isCurrentMonth && 'bg-default-100 text-default-500'
              )}
              onClick={(e) => {
                if (!isPopoverOpen) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickY = e.clientY - rect.top;
                  const cellHeight = rect.height;

                  const startHour = TIMINGS.appointment.start;
                  const endHour = TIMINGS.appointment.end;
                  const hourRange = endHour - startHour;

                  const clickRatio = Math.max(
                    0,
                    Math.min(1, clickY / cellHeight)
                  );
                  const selectedHour = startHour + clickRatio * hourRange;

                  const minutes =
                    Math.round((selectedHour % 1) * 4) * TIME_INTERVAL;
                  const hour = Math.floor(selectedHour);

                  const selectedDateTime = new Date(day);
                  selectedDateTime.setHours(hour, minutes, 0, 0);

                  onTimeSlotClick(selectedDateTime);
                }
              }}
            >
              <DateChip date={day} onClick={() => setView(View.Day)} />

              <div>
                {dayAppointments
                  .slice(0, maxAppointmentsToShow)
                  .map((appointment) => (
                    <Appointment
                      appointment={appointment}
                      key={appointment.aid}
                      onOpenChange={(open) => {
                        if (open) {
                          setIsPopoverOpen(true);
                        } else {
                          setTimeout(() => {
                            setIsPopoverOpen(false);
                          }, POPOVER_DELAY);
                        }
                      }}
                    />
                  ))}
                {dayAppointments.length > maxAppointmentsToShow && (
                  <Popover
                    onOpenChange={(open) => {
                      // instantly open the popover but delay by 100ms when closing
                      if (open) {
                        setIsPopoverOpen(true);
                      } else {
                        setTimeout(() => {
                          setIsPopoverOpen(false);
                        }, POPOVER_DELAY);
                      }
                    }}
                  >
                    <PopoverTrigger>
                      <button className="truncate rounded-lg p-1 px-2 text-start text-tiny hover:bg-default-100">
                        {dayAppointments.length - maxAppointmentsToShow} more
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <AppointmentList
                        appointments={dayAppointments}
                        date={day}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AppointmentList({
  appointments,
  date,
}: {
  appointments: AppointmentType[] | null;
  date: Date;
}) {
  const [_view, setView] = useQueryState('view', parseAsStringEnum(views));
  return (
    <Card className="flex max-w-xs flex-col shadow-none">
      <CardHeader className="flex-col items-center gap-2 pb-0">
        <span className="text-small font-medium uppercase">
          {format(date, 'E')}
        </span>
        <DateChip date={date} size="lg" onClick={() => setView(View.Day)} />
      </CardHeader>
      <CardBody as={ScrollShadow} className="max-h-40 flex-col pt-2">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Appointment appointment={appointment} key={appointment.aid} />
          ))
        ) : (
          <p className="pb-4 text-center text-small text-default-500">
            There are no appointments for this day
          </p>
        )}
      </CardBody>
      <CardFooter className="pt-0">
        {appointments && appointments.length > 0 && (
          <p className="text-center text-tiny text-default-500">
            Total appointments: {appointments.length}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

export function Appointment({
  appointment,
  onOpenChange,
  popoverPlacement = 'right',
  fullWidth = true,
}: {
  appointment: AppointmentType;
  onOpenChange?: (isOpen: boolean) => void;
  popoverPlacement?: PopoverProps['placement'];
  fullWidth?: boolean;
}) {
  return (
    <Popover
      placement={popoverPlacement}
      shouldCloseOnScroll={false}
      shouldBlockScroll
      onOpenChange={onOpenChange}
    >
      <PopoverTrigger>
        <div
          key={appointment.aid}
          className={cn(
            'flex min-h-6 cursor-pointer items-center justify-start gap-1 truncate rounded-lg p-1 px-2 text-tiny hover:bg-default-100',
            appointment.status === 'cancelled' && 'line-through',
            !fullWidth && 'w-fit'
          )}
        >
          <StatusRenderer isDotOnly status={appointment.status} />
          <div className="font-light">
            {formatTime(new Date(appointment.date))}
          </div>
          <div className="font-medium">
            {appointment.patient.name}{' '}
            {appointment.doctor?.name ? `- ${appointment.doctor.name}` : ''}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <AppointmentPopover appointment={appointment} />
      </PopoverContent>
    </Popover>
  );
}
