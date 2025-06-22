'use client';

import { useEffect, useState } from 'react';
import { CalendarHeader } from './header';
import { MonthView } from './views/month';
import { WeekView } from './views/week';
import { DayView } from './views/day';
import { ScheduleView } from './views/schedule';
import { YearView } from './views/year';
import NewAppointmentModal from './new/new';
import { AppointmentType } from '@/types/appointment';
import { View, views } from './types';
import { parseAsStringEnum, useQueryState, parseAsIsoDateTime } from 'nuqs';

interface CalendarProps {
  appointments: AppointmentType[];
}

export function Calendar({ appointments }: CalendarProps) {
  const [view, setView] = useQueryState(
    'view',
    parseAsStringEnum(views).withDefault(View.Month)
  );
  const [currentDate, setCurrentDate] = useQueryState(
    'date',
    parseAsIsoDateTime.withDefault(new Date())
  );

  const [showDialog, setShowDialog] = useState(false);

  const handleTimeSlotClick = (date: Date, time?: string) => {
    setCurrentDate(date);
    setShowDialog(true);
  };

  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <MonthView
            appointments={appointments}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case 'week':
        return (
          <WeekView
            appointments={appointments}
            currentDate={currentDate}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case 'day':
        return (
          <DayView
            appointments={appointments}
            currentDate={currentDate}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case 'schedule':
        return (
          <ScheduleView
            appointments={appointments}
            currentDate={currentDate}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case 'year':
        return (
          <YearView appointments={appointments} currentDate={currentDate} />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'm') {
        setView('month');
      } else if (event.key === 'y') {
        setView('year');
      } else if (event.key === 'w') {
        setView('week');
      } else if (event.key === 'd') {
        setView('day');
      } else if (event.key === 's') {
        setView('schedule');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setView]);

  return (
    <div className="flex h-[calc(100vh_-_60px)] max-h-[calc(100vh_-_60px)] flex-col overflow-hidden">
      <CalendarHeader currentDate={currentDate} onDateChange={setCurrentDate} />
      <div className="h-[calc(100vh_-_120px)] flex-1">{renderView()}</div>
      <NewAppointmentModal
        open={showDialog}
        onOpenChange={setShowDialog}
        selectedDate={currentDate}
      />
    </div>
  );
}
