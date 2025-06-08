'use client';

import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/models/Appointment';

interface WeekViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date, time: string) => void;
}

export function WeekView({
  appointments,
  currentDate,
  onTimeSlotClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getAppointmentsForDayAndHour = (date: Date, hour: number) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return isSameDay(aptDate, date) && aptDate.getHours() === hour;
    });
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
    <div className="flex h-full flex-col">
      {/* Week header */}
      <div className="flex border-b">
        <div className="w-20 border-r"></div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="flex-1 border-r p-2 text-center last:border-r-0"
          >
            <div className="text-muted-foreground text-small">
              {format(day, 'EEE')}
            </div>
            <div
              className={cn(
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-large font-medium',
                isToday(day) && 'bg-blue-600 text-white'
              )}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b">
              <div className="text-muted-foreground w-20 border-r p-2 text-right text-small">
                {hour === 0
                  ? '12 AM'
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? '12 PM'
                      : `${hour - 12} PM`}
              </div>
              {weekDays.map((day) => {
                const dayAppointments = getAppointmentsForDayAndHour(day, hour);
                const timeString = `${hour.toString().padStart(2, '0')}:00`;

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="hover:bg-muted/50 relative min-h-[60px] flex-1 cursor-pointer border-r p-1 last:border-r-0"
                    onClick={() => onTimeSlotClick(day, timeString)}
                  >
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt._id}
                        className={cn(
                          'absolute inset-1 rounded p-1 text-tiny text-white',
                          getStatusColor(apt.status)
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle appointment click
                        }}
                      >
                        <div className="truncate font-medium">
                          {apt.patient.name}
                        </div>
                        <div className="truncate opacity-90">{apt.type}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
