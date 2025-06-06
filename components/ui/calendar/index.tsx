'use client';

import { useState } from 'react';
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
  const { view } = useCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleTimeSlotClick = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time || null);
    setShowDialog(true);
  };

  const handleCreateAppointment = (appointmentData: any) => {
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

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader currentDate={currentDate} onDateChange={onDateChange} />
      <div className="flex-1 overflow-hidden">{renderView()}</div>
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
