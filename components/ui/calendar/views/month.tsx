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
import { AppointmentType } from '@/models/Appointment';
import { useCalendar } from '../store';
import {
  Card,
  CardBody,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import DateChip from '../ui/date-chip';
import { formatTime } from '../helper';
import StatusRenderer from '../ui/status-renderer';
import AppointmentPopover from '../ui/appointment-popover';
import { useState } from 'react';

interface MonthViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
}

const MAX_APPOINTMENTS_PER_DAY = 2;

export function MonthView({
  appointments,
  currentDate,
  onTimeSlotClick,
}: MonthViewProps) {
  const { setView } = useCalendar();
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
              onDoubleClick={() => {
                if (!isPopoverOpen) {
                  onTimeSlotClick(day);
                }
              }}
            >
              <DateChip
                date={day}
                onClick={() => setView('day', { date: day })}
              />

              <div>
                {dayAppointments
                  .slice(0, maxAppointmentsToShow)
                  .map((appointment) => (
                    <Appointment
                      appointment={appointment}
                      key={appointment.aid}
                      onOpenChange={setIsPopoverOpen}
                    />
                  ))}
                {dayAppointments.length > maxAppointmentsToShow && (
                  <Popover onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger>
                      <button className="w-full truncate rounded-lg p-1 px-2 text-start text-tiny hover:bg-default-100">
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

function AppointmentList({
  appointments,
  date,
}: {
  appointments: AppointmentType[];
  date: Date;
}) {
  const { setView } = useCalendar();

  return (
    <Card className="flex max-w-xs flex-col gap-2 shadow-none">
      <CardHeader className="flex-col items-center gap-2 pb-0">
        <span className="text-small font-medium">{format(date, 'E')}</span>
        <DateChip
          date={date}
          size="lg"
          onClick={() => setView('day', { date })}
        />
      </CardHeader>
      <CardBody className="pt-2">
        {appointments.map((appointment) => (
          <Appointment appointment={appointment} key={appointment.aid} />
        ))}
      </CardBody>
    </Card>
  );
}

function Appointment({
  appointment,
  onOpenChange,
}: {
  appointment: AppointmentType;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  return (
    <Popover
      placement="right"
      shouldCloseOnScroll={false}
      shouldBlockScroll
      onOpenChange={onOpenChange}
    >
      <PopoverTrigger>
        <div
          key={appointment.aid}
          className={cn(
            'flex cursor-pointer items-center justify-start gap-1 truncate rounded-lg p-1 px-2 text-tiny hover:bg-default-100',
            appointment.status === 'cancelled' && 'line-through'
          )}
        >
          <StatusRenderer isDotOnly status={appointment.status} />
          <span className="font-light">
            {formatTime(new Date(appointment.date))}
          </span>
          <span className="font-medium">
            {appointment.patient.name}{' '}
            {appointment.doctor?.name ? `- ${appointment.doctor.name}` : ''}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <AppointmentPopover appointment={appointment} />
      </PopoverContent>
    </Popover>
  );
}
