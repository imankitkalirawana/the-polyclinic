import React from 'react';

import { APPOINTMENT_STATUSES, AppointmentType, ButtonConfig } from '@/services/client/appointment';
import { useAppointmentActions } from './hooks/useAppointmentActions';
import RescheduleAppointment from '@/services/client/appointment/components/reschedule-modal';
import CancelModal from './components/cancel-modal';
import { ORGANIZATION_USER_ROLES, OrganizationUser } from '@/services/common/user';
import ChangeDoctorModal from './components/change-doctor-modal';

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
      statuses: [
        APPOINTMENT_STATUSES.confirmed,
        APPOINTMENT_STATUSES.in_progress,
        APPOINTMENT_STATUSES.on_hold,
        APPOINTMENT_STATUSES.overdue,
      ],
      roles: [
        ORGANIZATION_USER_ROLES.patient,
        ORGANIZATION_USER_ROLES.receptionist,
        ORGANIZATION_USER_ROLES.admin,
        ORGANIZATION_USER_ROLES.doctor,
      ],
      custom: (appointment) => appointment.status !== APPOINTMENT_STATUSES.in_progress,
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
      statuses: [APPOINTMENT_STATUSES.booked],
      roles: [ORGANIZATION_USER_ROLES.admin, ORGANIZATION_USER_ROLES.doctor],
      custom: (appointment) => appointment.doctor?.uid !== undefined,
    },
    action: {
      type: 'store-action',
      payload: 'decline',
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
      statuses: [
        APPOINTMENT_STATUSES.confirmed,
        APPOINTMENT_STATUSES.in_progress,
        APPOINTMENT_STATUSES.on_hold,
        APPOINTMENT_STATUSES.overdue,
      ],
      roles: [
        ORGANIZATION_USER_ROLES.doctor,
        ORGANIZATION_USER_ROLES.receptionist,
        ORGANIZATION_USER_ROLES.admin,
      ],
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
      roles: [ORGANIZATION_USER_ROLES.doctor, ORGANIZATION_USER_ROLES.admin],
      custom: (appointment) => appointment.doctor?.uid !== undefined,
    },
    action: {
      type: 'store-action',
      payload: 'change-doctor',
    },
    content: () => <ChangeDoctorModal />,
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
      roles: [
        ORGANIZATION_USER_ROLES.patient,
        ORGANIZATION_USER_ROLES.doctor,
        ORGANIZATION_USER_ROLES.receptionist,
        ORGANIZATION_USER_ROLES.admin,
      ],
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
      statuses: [APPOINTMENT_STATUSES.booked],
      roles: [ORGANIZATION_USER_ROLES.doctor, ORGANIZATION_USER_ROLES.admin],
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
      roles: [ORGANIZATION_USER_ROLES.doctor, ORGANIZATION_USER_ROLES.admin],
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
  role: OrganizationUser['role']
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
