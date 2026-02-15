'use client';

import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent } from '@heroui/react';
import { parseAsIsoDateTime, parseAsStringEnum, useQueryState } from 'nuqs';

import AppointmentDrawer from './ui/appointment-drawer';
import { DayView } from './views/day';
import { MonthView } from './views/month';
import { ScheduleView } from './views/schedule';
import { WeekView } from './views/week';
import { YearView } from './views/year';
import { CalendarHeader } from './header';
import { views } from './types';

import CreateAppointment from '@/components/dashboard/appointments/create';
import { AppointmentType } from '@/services/client/appointment';
import { useAppointmentStore } from '@/services/client/appointment/appointment.store';

interface CalendarProps {
  appointments: AppointmentType[];
}

export function Calendar({ appointments }: CalendarProps) {
  const [view] = useQueryState('view', parseAsStringEnum(views).withDefault('schedule'));
  const { aid } = useAppointmentStore();
  const [currentDate, setCurrentDate] = useQueryState(
    'date',
    parseAsIsoDateTime.withDefault(new Date())
  );

  const [showDialog, setShowDialog] = useState(false);

  const handleTimeSlotClick = (date: Date) => {
    setCurrentDate(date);
    setShowDialog(true);
  };

  const renderView = () => {
    switch (view) {
      case 'month':
        return <MonthView appointments={appointments} onTimeSlotClick={handleTimeSlotClick} />;
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
        return <ScheduleView appointments={appointments} currentDate={currentDate} />;
      case 'year':
        return <YearView appointments={appointments} currentDate={currentDate} />;
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
      <div className="flex h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] flex-col overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onToday={() => setCurrentDate(new Date())}
          onCreateAppointment={handleCreateAppointment}
        />
        <div className="h-[calc(100vh-120px)] flex-1">{renderView()}</div>
      </div>
      {aid && <AppointmentDrawer />}
      <Modal
        isOpen={showDialog}
        size="full"
        onOpenChange={setShowDialog}
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalBody>
            <CreateAppointment isModal date={currentDate} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
