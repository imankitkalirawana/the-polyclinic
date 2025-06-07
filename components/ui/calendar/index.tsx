'use client';

import { useEffect, useState } from 'react';
import { CalendarHeader } from './header';
import { MonthView } from './views/month';
import { WeekView } from './views/week';
import { DayView } from './views/day';
import { ScheduleView } from './views/schedule';
import { YearView } from './views/year';
import { AppointmentDialog } from './dialog';
import { AppointmentType } from '@/models/Appointment';
import { useCalendar } from './store';

interface CalendarProps {
  appointments: AppointmentType[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCreateAppointment: (date: Date, time?: string) => void;
}

export function Calendar({
  appointments,
  currentDate,
  onDateChange,
  onCreateAppointment,
}: CalendarProps) {
  const { view, setView } = useCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleTimeSlotClick = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time || null);
    setShowDialog(true);
  };

  const handleCreateAppointment = () => {
    if (selectedDate) {
      onCreateAppointment(selectedDate, selectedTime || undefined);
      setShowDialog(false);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <MonthView
            appointments={appointments}
            currentDate={currentDate}
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
          <YearView
            appointments={appointments}
            currentDate={currentDate}
            onDateChange={onDateChange}
            onTimeSlotClick={handleTimeSlotClick}
          />
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
      <CalendarHeader currentDate={currentDate} onDateChange={onDateChange} />
      <div className="h-full flex-1">{renderView()}</div>
      <AppointmentDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onCreateAppointment={handleCreateAppointment}
      />
    </div>
  );
}
