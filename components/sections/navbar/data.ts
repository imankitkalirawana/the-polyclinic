// role based navbar

import { UserRole } from '@/shared';

export const navItems = [
  {
    name: 'Home',
    href: '/',
    roles: [...Object.values(UserRole)],
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    thumbnail: '/assets/navbar/dashboard.webp',
    roles: [...Object.values(UserRole)],
    subItems: [
      {
        title: 'My Dashboard',
        items: [
          {
            name: 'Overview',
            href: '/dashboard',
            icon: 'solar:window-frame-bold-duotone',
            roles: [...Object.values(UserRole)],
          },

          {
            name: 'Users',
            href: '/dashboard/users',
            icon: 'solar:users-group-rounded-bold-duotone',
            roles: [...Object.values(UserRole)] as const,
          },
          {
            name: 'Drugs',
            href: '/dashboard/drugs',
            icon: 'solar:pills-bold-duotone',
            roles: [UserRole.ADMIN] as const,
          },
          {
            name: 'Available Slots',
            href: '/dashboard/doctors/slots',
            icon: 'solar:calendar-bold-duotone',
            roles: [UserRole.DOCTOR] as const,
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
            roles: [UserRole.ADMIN] as const,
          },
          {
            name: 'Settings',
            href: '/dashboard/admin/settings',
            icon: 'solar:settings-bold-duotone',
            roles: [UserRole.ADMIN] as const,
          },
        ],
      },
    ],
  },
  {
    name: 'Appointments',
    href: '/dashboard/appointments',
    thumbnail: '/assets/navbar/appointments.png',
    roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR, UserRole.PATIENT] as const,
    subItems: [
      {
        title: 'Appointments',
        items: [
          {
            name: 'Create New',
            href: '/dashboard/appointments/create',
            icon: 'solar:pen-new-round-bold-duotone',
            roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT] as const,
          },
          {
            name: 'Generate Token',
            href: '/dashboard/queues/new',
            icon: 'solar:clipboard-list-bold-duotone',
            roles: [
              UserRole.PATIENT,
              UserRole.DOCTOR,
              UserRole.RECEPTIONIST,
              UserRole.ADMIN,
            ] as const,
          },
        ],
      },
      {
        title: 'My Appointments',
        items: [
          {
            name: 'My Schedules',
            href: '/dashboard/appointments?view=schedule',
            icon: 'solar:calendar-bold-duotone',
            roles: [
              UserRole.ADMIN,
              UserRole.RECEPTIONIST,
              UserRole.PATIENT,
              UserRole.DOCTOR,
            ] as const,
          },
          {
            name: 'All Appointments',
            href: '/dashboard/appointments?view=month',
            icon: 'solar:clipboard-list-bold-duotone',
            roles: [
              UserRole.ADMIN,
              UserRole.RECEPTIONIST,
              UserRole.PATIENT,
              UserRole.DOCTOR,
            ] as const,
          },
          {
            name: 'Token Appointments',
            href: '/dashboard/queues',
            icon: 'solar:clipboard-list-bold-duotone',
            roles: [
              UserRole.ADMIN,
              UserRole.RECEPTIONIST,
              UserRole.PATIENT,
              UserRole.DOCTOR,
            ] as const,
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
