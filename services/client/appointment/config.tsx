import React from 'react';
import { addToast } from '@heroui/react';

import AddToCalendar from '@/components/ui/appointments/add-to-calendar';
import { ButtonConfig } from '@/types/client/appointment';
import { $FixMe } from '@/types';
import CancelDeleteAppointment from '@/components/client/appointments/ui/cancel-delete';
import RescheduleAppointment from '@/components/client/appointments/ui/reschedule-modal';
import { AppointmentType } from '@/services/client/appointment';

export const APPOINTMENT_BUTTON_CONFIGS: ButtonConfig[] = [
  {
    key: 'add-to-calendar',
    label: 'Add to Calendar',
    icon: 'solar:calendar-add-bold-duotone',
    color: 'default',
    variant: 'flat',
    position: 'left',
    visibilityRules: {
      statuses: ['booked', 'confirmed', 'in-progress'],
      roles: ['patient', 'doctor'],
    },
    action: {
      type: 'store-action',
      payload: 'add-to-calendar',
    },
    content: AddToCalendar,
  },
  {
    key: 'cancel',
    label: 'Cancel Appointment',
    icon: 'solar:close-circle-bold-duotone',
    color: 'danger',
    variant: 'flat',
    position: 'right',
    isIconOnly: true,
    visibilityRules: {
      statuses: ['booked', 'confirmed', 'in-progress', 'on-hold', 'overdue'],
      roles: ['patient', 'receptionist', 'admin'],
      custom: (appointment) => appointment.status !== 'in-progress',
    },
    action: {
      type: 'store-action',
      payload: 'cancel',
    },
    content: () => <CancelDeleteAppointment type="cancel" />,
  },
  {
    key: 'reminder',
    label: 'Send a Reminder',
    icon: 'solar:bell-bold-duotone',
    color: 'default',
    variant: 'flat',
    position: 'right',
    isIconOnly: true,
    whileLoading: 'Sending...',
    visibilityRules: {
      statuses: ['booked', 'confirmed', 'in-progress', 'on-hold', 'overdue'],
      roles: ['doctor', 'receptionist', 'admin'],
    },
    action: {
      type: 'async-function',
      handler: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        addToast({
          title: 'Reminder Sent',
          description: 'Reminder sent to the patient',
          color: 'success',
        });
      },
    },
  },
  {
    key: 'reschedule',
    label: 'Reschedule',
    icon: 'solar:calendar-bold-duotone',
    color: 'warning',
    variant: 'flat',
    position: 'right',
    visibilityRules: {
      statuses: ['booked', 'confirmed', 'in-progress', 'on-hold', 'overdue'],
      roles: ['patient', 'doctor', 'receptionist', 'admin'],
      custom: (appointment) =>
        appointment.status === 'booked' ||
        appointment.status === 'confirmed' ||
        appointment.status === 'overdue',
    },
    action: {
      type: 'store-action',
      payload: 'reschedule',
    },
    content: () => <RescheduleAppointment />,
  },
  {
    key: 'proceed',
    label: 'Proceed',
    icon: 'solar:arrow-right-bold-duotone',
    color: 'primary',
    variant: 'flat',
    position: 'right',
    visibilityRules: {
      statuses: ['confirmed', 'in-progress', 'on-hold'],
      roles: ['doctor', 'admin'],
    },
    action: {
      type: 'navigation',
      url: (appointment) => `/appointments/${appointment.aid}`,
    },
    content: () => <h2>Proceed</h2>,
  },
];

export const isButtonVisible = (
  config: ButtonConfig,
  appointment: AppointmentType | null,
  role: $FixMe['role']
): boolean => {
  if (!appointment) return false;

  const { visibilityRules } = config;

  // If there are no visibility rules, assume the button is visible
  if (!visibilityRules) return true;

  const { statuses, roles, custom } = visibilityRules;

  // Check if the appointment status is allowed
  const statusAllowed = statuses ? statuses.includes(appointment.status) : true;

  // Check if the user role is allowed
  const roleAllowed = roles ? roles.includes(role) : true;

  // Check the custom rule
  const customAllowed = typeof custom === 'function' ? custom(appointment, role) : true;

  return statusAllowed && roleAllowed && customAllowed;
};
