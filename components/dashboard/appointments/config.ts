import { UserRole } from '@/models/User';
import { ButtonConfig } from './types';

export const buttonConfigByRole: Record<UserRole, ButtonConfig[]> = {
  admin: [
    {
      label: 'Edit',
      action: (item) => {},
      color: 'primary',
      variant: 'flat',
      icon: 'solar:pen-bold-duotone',
      tooltip: 'Edit appointment details',
    },
    {
      label: 'Delete',
      action: (item) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
          console.log(`Deleting appointment ${item.aid}`);
          // Add API call to delete appointment
        }
      },
      color: 'danger',
      variant: 'flat',
      icon: 'solar:trash-bin-trash-bold-duotone',
      tooltip: 'Delete appointment',
    },
  ],
  doctor: [
    {
      label: 'Reschedule',
      action: (item) => {
        window.location.href = `/dashboard/appointments/${item.aid}/reschedule`;
      },
      color: 'warning',
      variant: 'flat',
      icon: 'solar:calendar-add-bold-duotone',
      tooltip: 'Reschedule appointment',
    },
    {
      label: 'Cancel',
      action: (item) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
          console.log(`Cancelling appointment ${item.aid}`);
          // Add API call to cancel appointment
        }
      },
      color: 'danger',
      variant: 'flat',
      icon: 'solar:close-circle-bold-duotone',
      tooltip: 'Cancel appointment',
    },
    {
      label: 'View Notes',
      action: (item) => {
        window.location.href = `/dashboard/appointments/${item.aid}/notes`;
      },
      color: 'default',
      variant: 'flat',
      icon: 'solar:notes-bold-duotone',
      tooltip: 'View appointment notes',
    },
  ],
  user: [
    {
      label: 'Reschedule',
      action: (item) => {
        window.location.href = `/dashboard/appointments/${item.aid}/reschedule`;
      },
      color: 'warning',
      variant: 'flat',
      icon: 'solar:calendar-add-bold-duotone',
      tooltip: 'Reschedule appointment',
    },
    {
      label: 'Cancel',
      action: (item) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
          console.log(`Cancelling appointment ${item.aid}`);
          // Add API call to cancel appointment
        }
      },
      color: 'danger',
      variant: 'flat',
      icon: 'solar:close-circle-bold-duotone',
      tooltip: 'Cancel appointment',
    },
  ],
  nurse: [],
  receptionist: [
    {
      label: 'Edit',
      action: (item) => {
        window.location.href = `/dashboard/appointments/${item.aid}/edit`;
      },
      color: 'primary',
      variant: 'flat',
      icon: 'solar:pen-bold-duotone',
      tooltip: 'Edit appointment details',
    },
  ],
  pharmacist: [],
  laboratorist: [],
};
