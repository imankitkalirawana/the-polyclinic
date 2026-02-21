import React from 'react';

import { APPOINTMENT_STATUSES, ButtonConfig } from '@/services/client/appointment';
import { useAppointmentActions } from './hooks/useAppointmentActions';
import { UserRole } from '@/shared';
import { Appointment } from '@/shared';

export const createAppointmentButtonConfigs = (actions: {
  handleConfirm: (appointment: Appointment) => Promise<void>;
  handleReminder: (appointment: Appointment) => Promise<void>;
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
      statuses: [
        APPOINTMENT_STATUSES.confirmed,
        APPOINTMENT_STATUSES.in_progress,
        APPOINTMENT_STATUSES.on_hold,
        APPOINTMENT_STATUSES.overdue,
      ],
      roles: [UserRole.PATIENT, UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.DOCTOR],
      custom: (appointment) => appointment.status !== APPOINTMENT_STATUSES.in_progress,
    },
    action: {
      type: 'store-action',
      payload: 'cancel',
    },
  },
  {
    key: 'decline',
    label: 'Decline',
    icon: 'solar:minus-circle-bold-duotone',
    color: 'danger',
    variant: 'flat',
    position: 'left',
    visibilityRules: {
      statuses: [APPOINTMENT_STATUSES.booked],
      roles: [UserRole.ADMIN, UserRole.DOCTOR],
      custom: (appointment) => appointment.doctor?.uid !== undefined,
    },
    action: {
      type: 'store-action',
      payload: 'decline',
    },
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
      statuses: [
        APPOINTMENT_STATUSES.confirmed,
        APPOINTMENT_STATUSES.in_progress,
        APPOINTMENT_STATUSES.on_hold,
        APPOINTMENT_STATUSES.overdue,
      ],
      roles: [UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ADMIN],
    },
    action: {
      type: 'async-function',
      handler: actions.handleReminder,
    },
  },
  {
    key: 'change-doctor',
    label: 'Change Doctor',
    icon: 'solar:stethoscope-bold-duotone',
    color: 'warning',
    variant: 'flat',
    position: 'left',
    isIconOnly: true,
    visibilityRules: {
      statuses: [APPOINTMENT_STATUSES.booked, APPOINTMENT_STATUSES.confirmed],
      roles: [UserRole.RECEPTIONIST, UserRole.ADMIN],
      custom: (appointment) => appointment.doctor?.uid !== undefined,
    },
    action: {
      type: 'store-action',
      payload: 'change-doctor',
    },
    // content: () => <ChangeDoctorModal type="change-doctor" />,
  },
  {
    key: 'assign-doctor',
    label: 'Assign a doctor',
    icon: 'solar:user-plus-bold-duotone',
    color: 'primary',
    variant: 'flat',
    position: 'left',
    visibilityRules: {
      statuses: [APPOINTMENT_STATUSES.booked],
      roles: [UserRole.RECEPTIONIST, UserRole.ADMIN],
      custom: (appointment) => !appointment.doctor?.uid,
    },
    action: {
      type: 'store-action',
      payload: 'assign-doctor',
    },
    // content: () => <ChangeDoctorModal type="assign-doctor" />,
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
      statuses: [
        APPOINTMENT_STATUSES.booked,
        APPOINTMENT_STATUSES.confirmed,
        APPOINTMENT_STATUSES.in_progress,
        APPOINTMENT_STATUSES.on_hold,
        APPOINTMENT_STATUSES.overdue,
      ],
      roles: [UserRole.PATIENT, UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ADMIN],
      custom: (appointment) =>
        [
          APPOINTMENT_STATUSES.booked,
          APPOINTMENT_STATUSES.confirmed,
          APPOINTMENT_STATUSES.overdue,
        ].some((status) => status === appointment.status),
    },
    action: {
      type: 'store-action',
      payload: 'reschedule',
    },
    // content: () => <RescheduleAppointment />,
  },
  {
    key: 'accept',
    label: 'Accept',
    icon: 'solar:check-circle-bold-duotone',
    color: 'success',
    variant: 'flat',
    position: 'left',
    visibilityRules: {
      statuses: [APPOINTMENT_STATUSES.booked],
      roles: [UserRole.DOCTOR, UserRole.ADMIN],
      custom: (appointment) => appointment.doctor?.uid !== undefined,
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
      statuses: [
        APPOINTMENT_STATUSES.confirmed,
        APPOINTMENT_STATUSES.in_progress,
        APPOINTMENT_STATUSES.on_hold,
      ],
      roles: [UserRole.DOCTOR, UserRole.ADMIN],
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
  appointment: Appointment | null,
  role: UserRole | null
): boolean => {
  if (!appointment) return false;

  const { visibilityRules } = config;

  // If there are no visibility rules, assume the button is visible
  if (!visibilityRules) return true;

  const { statuses, roles, custom } = visibilityRules;

  // Check if the appointment status is allowed
  const statusAllowed = statuses ? statuses.includes(appointment.status) : true;

  // Check if the user role is allowed
  const roleAllowed = roles ? roles.includes(role ?? UserRole.GUEST) : true;

  // Check the custom rule
  const customAllowed =
    typeof custom === 'function' ? custom(appointment, role ?? UserRole.GUEST) : true;

  return statusAllowed && roleAllowed && customAllowed;
};
