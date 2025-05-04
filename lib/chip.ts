import { AppointmentStatus } from '@/models/Appointment';
import { DrugStatus } from '@/models/Drug';
import { ServiceStatus, ServiceTypes } from '@/models/Service';
import { UserRole, UserStatus } from '@/models/User';

export type ChipColorType =
  | UserRole
  | UserStatus
  | ServiceStatus
  | ServiceTypes
  | DrugStatus
  | AppointmentStatus;

export const chipColorMap: Record<ChipColorType, string> = {
  // for status
  active: 'bg-green-500',
  inactive: 'bg-gray-500',
  blocked: 'bg-pink-500',
  deleted: 'bg-red-500',
  unverified: 'bg-yellow-500',
  available: 'bg-green-500',
  unavailable: 'bg-red-500',

  // for roles
  admin: 'bg-red-500',
  doctor: 'bg-blue-500',
  nurse: 'bg-amber-500',
  receptionist: 'bg-yellow-500',
  pharmacist: 'bg-purple-500',
  laboratorist: 'bg-teal-500',
  user: 'bg-gray-500',

  //for appointment status
  overdue: 'bg-red-500',
  completed: 'bg-green-500',
  cancelled: 'bg-default-500',
  'on-hold': 'bg-yellow-500',
  booked: 'bg-blue-500',
  confirmed: 'bg-teal-500',
  'in-progress': 'bg-purple-500',

  // for service types
  medical: 'bg-red-500',
  surgical: 'bg-blue-500',
  diagnostic: 'bg-green-500',
  consultation: 'bg-yellow-500',
};
