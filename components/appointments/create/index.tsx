'use client';

import React from 'react';

import AppointmentContent, { CreateAppointmentProvider } from './content';
import { CreateAppointmentSidebar } from './sidebar';

export default function CreateAppointment() {
  return (
    <CreateAppointmentProvider>
      <div className="flex h-[calc(100vh-3.75rem)] gap-4 overflow-hidden">
        <CreateAppointmentSidebar />
        <AppointmentContent />
      </div>
    </CreateAppointmentProvider>
  );
}
