import { AppointmentType } from '@/services/client/appointment';
import { Role, UserStatus } from '@/services/common/user/user.constants';
import { DrugStatus } from '@/services/client/drug/drug.types';
import { ServiceStatus, ServiceTypes } from '@/services/client/service/service.types';
import { QueueStatus } from '@/services/client/appointment/queue/queue.types';

export type ChipColorType =
  | Role
  | UserStatus
  | ServiceStatus
  | ServiceTypes
  | DrugStatus
  | AppointmentType['status']
  | QueueStatus;

export const chipColorMap: Record<ChipColorType, string> = {
  /* for status */
  BLOCKED: 'bg-pink-100 text-pink-700',
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-red-100 text-red-700',
  available: 'bg-green-100 text-green-700',
  unavailable: 'bg-red-100 text-red-700',

  /* for roles */
  ADMIN: 'bg-red-100 text-red-700',
  DOCTOR: 'bg-blue-100 text-blue-700',
  NURSE: 'bg-amber-100 text-amber-700',
  RECEPTIONIST: 'bg-yellow-100 text-yellow-700',

  /* for appointment status */
  overdue: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-default-100 text-default-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
  booked: 'bg-cyan-100 text-cyan-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-violet-100 text-violet-700',

  /* for service types */
  medical: 'bg-red-100 text-red-700',
  surgical: 'bg-blue-100 text-blue-700',
  diagnostic: 'bg-green-100 text-green-700',
  consultation: 'bg-yellow-100 text-yellow-700',
  PATIENT: 'bg-emerald-100 text-emerald-700',

  /* for queue status */
  PAYMENT_PENDING: 'bg-yellow-100 text-yellow-700',
  PAYMENT_FAILED: 'bg-danger-100 text-danger-700',
  BOOKED: 'bg-default-100 text-default-700',
  CALLED: 'bg-blue-100 text-blue-700',
  IN_CONSULTATION: 'bg-violet-100 text-violet-700',
  SKIPPED: 'bg-cyan-100 text-cyan-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-success-100 text-success-700',
};
