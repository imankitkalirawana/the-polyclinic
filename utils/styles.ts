'use client';
import { AppointmentType } from '@/models/Appointment';

export const getAppointmentStyles = (status: AppointmentType['status']) => {
  switch (status) {
    case 'booked':
      return {
        background: 'bg-default-50',
        avatarBg: 'bg-default-100',
        avatar: 'text-default-500',
        iconBg: 'bg-default-500',
        icon: 'text-white',
      };
    case 'confirmed':
      return {
        background: 'bg-lime-50',
        avatarBg: 'bg-lime-100',
        avatar: 'text-lime-500',
        iconBg: 'bg-lime-500',
        icon: 'text-white',
      };
    case 'in-progress':
      return {
        background: 'bg-blue-50',
        avatarBg: 'bg-blue-100',
        avatar: 'text-blue-500',
        iconBg: 'bg-blue-500',
        icon: 'text-white',
      };
    case 'completed':
      return {
        background: 'bg-success-50',
        avatarBg: 'bg-success-100',
        avatar: 'text-success-500',
        iconBg: 'bg-success-500',
        icon: 'text-white',
      };
    case 'cancelled':
      return {
        background: 'bg-danger-50',
        avatarBg: 'bg-danger-100',
        avatar: 'text-danger-500',
        iconBg: 'bg-danger-500',
        icon: 'text-white',
      };
    case 'overdue':
      return {
        background: 'bg-warning-50',
        avatarBg: 'bg-warning-100',
        avatar: 'text-warning-500',
        iconBg: 'bg-warning-500',
        icon: 'text-white',
      };
    case 'on-hold':
      return {
        background: 'bg-info-50',
        avatarBg: 'bg-info-100',
        avatar: 'text-info-500',
        iconBg: 'bg-info-500',
        icon: 'text-white',
      };
    default:
      return {
        background: 'bg-default-50',
        avatarBg: 'bg-default-100',
        avatar: 'text-default-500',
        iconBg: 'bg-default-500',
        icon: 'text-white',
      };
  }
};
