import { QueueStatus } from '@/shared';
import { UserRole } from '@/shared';
import { ChipProps } from '@heroui/react';

const USER_ROLE_CONFIG: Record<UserRole, ChipProps['classNames']> = {
  [UserRole.ADMIN]: {
    base: 'bg-red-100 text-red-700',
    content: 'text-red-700',
  },
  [UserRole.DOCTOR]: {
    base: 'bg-blue-100 text-blue-700',
    content: 'text-blue-700',
  },
  [UserRole.NURSE]: {
    base: 'bg-amber-100 text-amber-700',
    content: 'text-amber-700',
  },
  [UserRole.RECEPTIONIST]: {
    base: 'bg-yellow-100 text-yellow-700',
    content: 'text-yellow-700',
  },
  [UserRole.PATIENT]: {
    base: 'bg-green-100 text-green-700',
    content: 'text-green-700',
  },
  [UserRole.SUPER_ADMIN]: undefined,
  [UserRole.MODERATOR]: undefined,
  [UserRole.OPS]: undefined,
  [UserRole.GUEST]: undefined,
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
