'use client';

import { useState } from 'react';
import { CalendarHeader } from './header';
import { MonthView } from './views/month';
import { WeekView } from './views/week';
import { DayView } from './views/day';
import { ScheduleView } from './views/schedule';
import { YearView } from './views/year';
import { AppointmentType } from '@/types/appointment';
import { views } from './types';
import { parseAsStringEnum, useQueryState, parseAsIsoDateTime } from 'nuqs';
import AppointmentDrawer from './ui/appointment-drawer';
import { CreateAppointment } from '@/components/appointments/create';

interface CalendarProps {
  appointments: AppointmentType[];
}

export function Calendar({ appointments }: CalendarProps) {
  const [view] = useQueryState(
    'view',
    parseAsStringEnum(views).withDefault('schedule')
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
          <ScheduleView appointments={appointments} currentDate={currentDate} />
        );
      case 'year':
        return (
          <YearView appointments={appointments} currentDate={currentDate} />
        );
      default:
        return null;
    }
  };

  const handleCreateAppointment = () => {
    const now = new Date();
    const minutes = now.getMinutes();

    const nextQuarter = Math.ceil(minutes / 15) * 15;

    if (nextQuarter >= 60) {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    } else {
      now.setMinutes(nextQuarter);
    }

    now.setSeconds(0);
    now.setMilliseconds(0);

    setCurrentDate(now);
    setShowDialog(true);
  };

  return (
    <>
      <div className="flex h-[calc(100vh_-_60px)] max-h-[calc(100vh_-_60px)] flex-col overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onToday={() => setCurrentDate(new Date())}
          onCreateAppointment={handleCreateAppointment}
        />
        <div className="h-[calc(100vh_-_120px)] flex-1">{renderView()}</div>
      </div>
      <AppointmentDrawer />
      <CreateAppointment
        open={showDialog}
        onOpenChange={setShowDialog}
        selectedDate={currentDate}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
}
