'use client';

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/models/Appointment';

interface MonthViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
}

export function MonthView({
  appointments,
  currentDate,
  onTimeSlotClick,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), date));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col">
      {/* Week header */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-muted-foreground border-r p-2 text-center text-sm font-medium last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid flex-1 grid-cols-7 grid-rows-6">
        {days.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'hover:bg-muted/50 min-h-[120px] cursor-pointer border-b border-r p-1 last:border-r-0',
                !isCurrentMonth && 'bg-muted/20 text-muted-foreground'
              )}
              onClick={() => onTimeSlotClick(day)}
            >
              <div
                className={cn(
                  'mb-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  isDayToday && 'bg-blue-600 text-white'
                )}
              >
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt._id}
                    className={cn(
                      'truncate rounded p-1 text-xs text-white',
                      getStatusColor(apt.status)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle appointment click
                    }}
                  >
                    {format(new Date(apt.date), 'HH:mm')} {apt.patient.name}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-muted-foreground text-xs">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
