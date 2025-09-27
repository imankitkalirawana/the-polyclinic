'use client';

import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent } from '@heroui/react';
import { parseAsIsoDateTime, useQueryState } from 'nuqs';

import AppointmentDrawer from '@/components/ui/calendar/ui/appointment-drawer';
import { CalendarHeader } from '@/components/ui/calendar/header';

import CreateAppointment from '@/components/client/appointments/create';

interface CalendarProps {
  children: React.ReactNode;
}

export default function AppointmentsLayout({ children }: CalendarProps) {
  const [currentDate, setCurrentDate] = useQueryState(
    'date',
    parseAsIsoDateTime.withDefault(new Date())
  );

  const [showDialog, setShowDialog] = useState(false);

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
        <div className="h-[calc(100vh_-_120px)] flex-1">{children}</div>
      </div>
      <AppointmentDrawer />
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
