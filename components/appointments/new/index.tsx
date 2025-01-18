'use client';

import {
  CalendarDate,
  getLocalTimeZone,
  Time,
  today
} from '@internationalized/date';
import * as React from 'react';
import { parseAsInteger, useQueryState } from 'nuqs';
import HorizontalSteps from './horizontal-steps';
import PatientSelection from './patient-selection';
import DateTimePicker from './date-time-picker';
import PatientProfile from './patient-profile';
import { cn, TimeInputValue } from '@nextui-org/react';
import AppointmentSummary from './additional-details';
import DoctorSelection from './doctor-selection';
import Sidebar from './sidebar';
import { TIMINGS } from '@/lib/config';
import AppointmentPreview from './appointment-preview';

export default function Appointments() {
  return (
    <div className="mx-auto flex max-w-8xl">
      <Sidebar />
      <AppointmentPreview />
    </div>
  );
}
