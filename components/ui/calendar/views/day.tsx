'use client';

import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/types/appointment';

interface DayViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date, time: string) => void;
}

export function DayView({
  appointments,
  currentDate,
  onTimeSlotClick,
}: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayAppointments = appointments.filter((apt) =>
    isSameDay(new Date(apt.date), currentDate)
  );

  const getAppointmentForHour = (hour: number) => {
    return dayAppointments.find((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.getHours() === hour;
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
      {/* Day header */}
      <div className="border-b p-4">
        <div className="text-center">
          <div className="text-muted-foreground text-small uppercase tracking-wide">
            {format(currentDate, 'EEEE')}
          </div>
          <div className="text-2xl font-bold">{format(currentDate, 'd')}</div>
        </div>
      </div>

      {/* Time slots */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {hours.map((hour) => {
            const appointment = getAppointmentForHour(hour);
            const timeString = `${hour.toString().padStart(2, '0')}:00`;

            return (
              <div
                key={hour}
                className="hover:bg-muted/50 flex cursor-pointer border-b"
                onClick={() => onTimeSlotClick(currentDate, timeString)}
              >
                <div className="text-muted-foreground w-20 border-r p-2 text-right text-small">
                  {hour === 0
                    ? '12 AM'
                    : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                        ? '12 PM'
                        : `${hour - 12} PM`}
                </div>
                <div className="relative min-h-[60px] flex-1 p-2">
                  {appointment && (
                    <div
                      className={cn(
                        'absolute inset-x-2 bottom-1 top-1 rounded p-2 text-small text-white',
                        getStatusColor(appointment.status)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle appointment click
                      }}
                    >
                      <div className="font-medium">
                        {appointment.patient.name}
                      </div>
                      <div className="text-tiny opacity-90">
                        {format(new Date(appointment.date), 'HH:mm')} -{' '}
                        {appointment.type}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
