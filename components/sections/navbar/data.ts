// role based navbar

import { SYSTEM_USER_ROLE, UNIFIED_USER_ROLES } from '@/services/common/user';

export const navItems = [
  {
    name: 'Home',
    href: '/home',
    roles: [...UNIFIED_USER_ROLES],
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    thumbnail: '/assets/navbar/dashboard.webp',
    roles: [...UNIFIED_USER_ROLES],
    subItems: [
      {
        title: 'My Dashboard',
        items: [
          {
            name: 'Overview',
            href: '/dashboard',
            icon: 'solar:window-frame-bold-duotone',
            roles: [...UNIFIED_USER_ROLES],
          },

          {
            name: 'Users',
            href: '/dashboard/users',
            icon: 'solar:users-group-rounded-bold-duotone',
            roles: [...SYSTEM_USER_ROLE, 'admin', 'receptionist'] as const,
          },
          {
            name: 'Drugs',
            href: '/dashboard/drugs',
            icon: 'solar:pills-bold-duotone',
            roles: ['admin'] as const,
          },
          {
            name: 'Available Slots',
            href: '/dashboard/doctors/slots',
            icon: 'solar:calendar-bold-duotone',
            roles: ['doctor'] as const,
          },
        ],
      },
      {
        title: 'Admin Dashboard',
        items: [
          {
            name: 'Stats',
            href: '/dashboard/admin/stats',
            icon: 'solar:graph-new-bold-duotone',
            roles: ['superadmin', 'admin'] as const,
          },
          {
            name: 'Settings',
            href: '/dashboard/admin/settings',
            icon: 'solar:settings-bold-duotone',
            roles: ['superadmin', 'admin'] as const,
          },
        ],
      },
    ],
  },
  {
    name: 'Appointments',
    href: '/appointments',
    thumbnail: '/assets/navbar/appointments.png',
    roles: ['admin', 'receptionist', 'doctor', 'patient'] as const,
    subItems: [
      {
        title: 'Appointments',
        items: [
          {
            name: 'Create New',
            href: '/appointments/create',
            icon: 'solar:pen-new-round-bold-duotone',
            roles: ['admin', 'receptionist', 'patient'] as const,
          },
        ],
      },
      {
        title: 'My Appointments',
        items: [
          {
            name: 'My Schedules',
            href: '/appointments?view=schedule',
            icon: 'solar:calendar-bold-duotone',
            roles: ['admin', 'receptionist', 'patient', 'doctor'] as const,
          },
          {
            name: 'All Appointments',
            href: '/appointments?view=month',
            icon: 'solar:clipboard-list-bold-duotone',
            roles: ['admin', 'receptionist', 'patient', 'doctor'] as const,
          },
        ],
      },
    ],
  },
  {
    name: 'About Us',
    href: '/about',
  },
  {
    name: 'Integrations',
    href: '/integrations',
  },
];
