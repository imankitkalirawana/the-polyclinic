import { AppointmentStatus } from '@/types/appointment';
import { DrugStatus } from '@/types/drug';
import { ServiceStatus, ServiceTypes } from '@/types/service';
import { UserType } from '@/types/user';

export type ChipColorType =
  | UserType['role']
  | UserType['status']
  | ServiceStatus
  | ServiceTypes
  | DrugStatus
  | AppointmentStatus;

export const chipColorMap: Record<
  ChipColorType,
  {
    text: string;
    bg: string;
  }
> = {
  // for status
  active: {
    text: 'bg-green-500',
    bg: 'bg-green-100',
  },
  inactive: {
    text: 'bg-gray-500',
    bg: 'bg-gray-100',
  },
  blocked: {
    text: 'bg-pink-500',
    bg: 'bg-pink-100',
  },
  deleted: {
    text: 'bg-red-500',
    bg: 'bg-red-100',
  },
  unverified: {
    text: 'bg-yellow-500',
    bg: 'bg-yellow-100',
  },
  available: {
    text: 'bg-green-500',
    bg: 'bg-green-100',
  },
  unavailable: {
    text: 'bg-red-500',
    bg: 'bg-red-100',
  },

  // for roles
  admin: {
    text: 'bg-red-500',
    bg: 'bg-red-100',
  },
  doctor: {
    text: 'bg-blue-500',
    bg: 'bg-blue-100',
  },
  nurse: {
    text: 'bg-amber-500',
    bg: 'bg-amber-100',
  },
  receptionist: {
    text: 'bg-yellow-500',
    bg: 'bg-yellow-100',
  },
  pharmacist: {
    text: 'bg-purple-500',
    bg: 'bg-purple-100',
  },

  //for appointment status
  overdue: {
    text: 'bg-red-500',
    bg: 'bg-red-100',
  },
  completed: {
    text: 'bg-green-500',
    bg: 'bg-green-100',
  },
  cancelled: {
    text: 'bg-default-500',
    bg: 'bg-default-100',
  },
  'on-hold': {
    text: 'bg-yellow-500',
    bg: 'bg-yellow-100',
  },
  booked: {
    text: 'bg-cyan-500',
    bg: 'bg-cyan-100',
  },

  // for service types
  medical: {
    text: 'bg-red-500',
    bg: 'bg-red-100',
  },
  surgical: {
    text: 'bg-blue-500',
    bg: 'bg-blue-100',
  },
  diagnostic: {
    text: 'bg-green-500',
    bg: 'bg-green-100',
  },
  consultation: {
    text: 'bg-yellow-500',
    bg: 'bg-yellow-100',
  },
  laboratorist: {
    text: 'bg-indigo-500',
    bg: 'bg-indigo-100',
  },
  user: {
    text: 'bg-emerald-500',
    bg: 'bg-emerald-100',
  },
  confirmed: {
    text: 'bg-blue-500',
    bg: 'bg-blue-100',
  },
  'in-progress': {
    text: 'bg-orange-500',
    bg: 'bg-orange-100',
  },
};
