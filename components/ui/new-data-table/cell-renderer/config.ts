import { QueueStatus } from '@/services/client/appointment/queue/queue.types';
import { Role } from '@/services/common/user/user.constants';
import { ChipProps } from '@heroui/react';

const USER_ROLE_CONFIG: Record<Role, ChipProps['classNames']> = {
  ADMIN: {
    base: 'bg-red-100 text-red-700',
    content: 'text-red-700',
  },
  DOCTOR: {
    base: 'bg-blue-100 text-blue-700',
    content: 'text-blue-700',
  },
  NURSE: {
    base: 'bg-amber-100 text-amber-700',
    content: 'text-amber-700',
  },
  RECEPTIONIST: {
    base: 'bg-yellow-100 text-yellow-700',
    content: 'text-yellow-700',
  },
  PATIENT: {
    base: 'bg-green-100 text-green-700',
    content: 'text-green-700',
  },
};

const APPOINTMENT_QUEUE_STATUS_CONFIG: Record<QueueStatus, ChipProps['classNames']> = {
  PAYMENT_PENDING: {
    base: 'bg-red-100 text-red-700',
    content: 'text-red-700',
  },
  PAYMENT_FAILED: {
    base: 'bg-green-100 text-green-700',
    content: 'text-green-700',
  },
  BOOKED: {
    base: 'bg-blue-100 text-blue-700',
    content: 'text-blue-700',
  },
  CALLED: {
    base: 'bg-yellow-100 text-yellow-700',
    content: 'text-yellow-700',
  },
  IN_CONSULTATION: {
    base: 'bg-green-100 text-green-700',
    content: 'text-green-700',
  },
  SKIPPED: {
    base: 'bg-red-100 text-red-700',
    content: 'text-red-700',
  },
  CANCELLED: {
    base: 'bg-yellow-100 text-yellow-700',
    content: 'text-yellow-700',
  },
  COMPLETED: {
    base: 'bg-green-100 text-green-700',
    content: 'text-green-700',
  },
};

export const CHIP_CONFIG: Record<string, ChipProps['classNames']> = {
  ...USER_ROLE_CONFIG,
  ...APPOINTMENT_QUEUE_STATUS_CONFIG,
};
