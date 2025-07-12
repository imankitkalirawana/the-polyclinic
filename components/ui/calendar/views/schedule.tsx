'use client';
import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { AppointmentType } from '@/types/appointment';
import { views } from '../types';
import DateChip from '../ui/date-chip';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import AppointmentTriggerItem from '../ui/appointment-trigger-item';

interface ScheduleViewProps {
  appointments: AppointmentType[];
  currentDate: Date;
}

export function ScheduleView({ appointments, currentDate }: ScheduleViewProps) {
  const [_view, setView] = useQueryState('view', parseAsStringEnum(views));
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
                      onClick={() => setView('day')}
                      size="md"
                    />
                    <p className="mt-1.5 text-tiny uppercase text-default-600">
                      {format(date, 'MMM, EEE')}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    {dayAppointments.map((apt) => (
                      <AppointmentTriggerItem key={apt.aid} appointment={apt} />
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
