import React from 'react';

import { $FixMe } from '@/types';
import { AppointmentType, ButtonConfig } from '@/services/client/appointment';
import { useAppointmentActions } from './hooks/useAppointmentActions';
import RescheduleAppointment from '@/components/client/appointments/ui/reschedule-modal';
import CancelModal from './components/cancel-modal';

export const createAppointmentButtonConfigs = (actions: {
  handleConfirm: (appointment: AppointmentType) => Promise<void>;
  handleReminder: (appointment: AppointmentType) => Promise<void>;
}): ButtonConfig[] => [
  {
    key: 'cancel',
    label: 'Cancel Appointment',
    icon: 'solar:close-circle-bold-duotone',
    color: 'danger',
    variant: 'flat',
    position: 'right',
    isIconOnly: true,
    visibilityRules: {
      statuses: ['confirmed', 'in-progress', 'on-hold', 'overdue'],
      roles: ['patient', 'receptionist', 'admin', 'doctor'],
      custom: (appointment) => appointment.status !== 'in-progress',
    },
    action: {
      type: 'store-action',
      payload: 'cancel',
    },
    content: () => <CancelModal />,
  },
  {
    key: 'decline',
    label: 'Decline',
    icon: 'solar:close-circle-bold-duotone',
    color: 'danger',
    variant: 'flat',
    position: 'left',
    visibilityRules: {
      statuses: ['booked'],
      roles: ['admin', 'doctor'],
    },
    action: {
      type: 'store-action',
      payload: 'cancel',
    },
    content: () => <CancelModal />,
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
      statuses: ['confirmed', 'in-progress', 'on-hold', 'overdue'],
      roles: ['doctor', 'receptionist', 'admin'],
    },
    action: {
      type: 'async-function',
      handler: actions.handleReminder,
    },
  },

  {
    key: 'reschedule',
    label: 'Reschedule',
    icon: 'solar:calendar-bold-duotone',
    color: 'warning',
    variant: 'flat',
    isIconOnly: true,
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
    key: 'accept',
    label: 'Accept',
    icon: 'solar:check-circle-line-duotone',
    color: 'success',
    variant: 'flat',
    position: 'left',
    visibilityRules: {
      statuses: ['booked'],
      roles: ['doctor', 'admin'],
    },
    action: {
      type: 'async-function',
      handler: actions.handleConfirm,
    },
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

export const useAppointmentButtonConfigs = () => {
  const { handleConfirm, handleReminder } = useAppointmentActions();

  return createAppointmentButtonConfigs({
    handleConfirm,
    handleReminder,
  });
};

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
