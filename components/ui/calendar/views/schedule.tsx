'use client';

import {
  format,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { AppointmentType } from '@/models/Appointment';
import { chipColorMap } from '@/lib/chip';
import { Tooltip } from '@heroui/react';
import { useCalendar } from '../store';
import DateChip from '../ui/date-chip';
import StatusDot from '../ui/status-dot';
import { formatTime } from '../helper';

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
  const { setView } = useCalendar();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const monthAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      return isWithinInterval(aptDate, { start: monthStart, end: monthEnd });
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
        <div className="divide-y divide-default-200">
          {Object.entries(groupedAppointments).map(
            ([dateKey, dayAppointments]) => {
              const date = new Date(dateKey);

              return (
                <div key={dateKey} className="flex w-full items-start py-1">
                  <div className="flex w-28 items-center gap-2">
                    <DateChip
                      date={date}
                      onClick={() => setView('day', { date: date })}
                      size="md"
                    />
                    <p className="mt-1.5 text-xs uppercase text-default-600">
                      {format(date, 'MMM, EEE')}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.aid}
                        className="flex w-full cursor-pointer rounded-large p-1.5 px-2 transition-all hover:bg-default-100"
                        onClick={() => onTimeSlotClick(new Date(apt.date))}
                      >
                        <div className="flex w-full max-w-24 items-center gap-2">
                          <StatusDot status={apt.status} />
                          <p className="text-sm">
                            {formatTime(new Date(apt.date))}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <p className="text-sm font-medium">
                            {apt.patient.name}
                          </p>
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
