'use client';

import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/models/Appointment';

interface ScheduleViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onTimeSlotClick: (date: Date) => void;
}

export function ScheduleView({
  appointments,
  currentDate,
  onTimeSlotClick,
}: ScheduleViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const monthAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      return isWithinInterval(aptDate, { start: monthStart, end: monthEnd });
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const groupedAppointments = monthAppointments.reduce(
    (groups, apt) => {
      const dateKey = format(new Date(apt.date), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(apt);
      return groups;
    },
    {} as Record<string, AppointmentType[]>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {Object.entries(groupedAppointments).map(
            ([dateKey, dayAppointments]) => {
              const date = new Date(dateKey);

              return (
                <div key={dateKey} className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {format(date, 'd')}
                      </div>
                      <div className="text-muted-foreground text-sm uppercase tracking-wide">
                        {format(date, 'EEE')}
                      </div>
                    </div>
                    <div className="bg-border h-px flex-1"></div>
                  </div>

                  <div className="ml-16 space-y-2">
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt._id}
                        className={cn(
                          'cursor-pointer rounded-lg border p-3 transition-shadow hover:shadow-sm',
                          getStatusColor(apt.status)
                        )}
                        onClick={() => onTimeSlotClick(new Date(apt.date))}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {apt.patient.name}
                            </div>
                            <div className="text-sm opacity-75">
                              {apt.doctor?.name || 'No doctor assigned'} •{' '}
                              {apt.type}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {format(new Date(apt.date), 'HH:mm')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}

          {Object.keys(groupedAppointments).length === 0 && (
            <div className="text-muted-foreground py-12 text-center">
              <div className="mb-2 text-lg font-medium">
                No appointments this month
              </div>
              <div className="text-sm">
                Click anywhere to create a new appointment
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
