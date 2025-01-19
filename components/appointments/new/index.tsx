'use client';

import * as React from 'react';
import Sidebar from './sidebar';
import AppointmentPreview from './appointment-preview';

export default function Appointments() {
  return (
    <div className="mx-auto flex max-w-8xl">
      <Sidebar />
      <AppointmentPreview />
    </div>
  );
}
