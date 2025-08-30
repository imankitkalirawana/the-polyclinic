// role based navbar

import { UnifiedUser } from '@/services/common/user';
import { NavItem } from './types';

export const itemsMap: Record<UnifiedUser['role'], NavItem[]> = {
  superadmin: [
    {
      name: 'Home',
      href: '/home',
    },
  ],
  moderator: [
    {
      name: 'Home',
      href: '/home',
    },
  ],
  ops: [
    {
      name: 'Home',
      href: '/home',
    },
  ],
  admin: [
    {
      name: 'Home',
      href: '/home',
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      thumbnail: '/assets/navbar/dashboard.webp',
      subItems: [
        {
          title: 'My Dashboard',
          items: [
            {
              name: 'Overview',
              href: '/dashboard',
              icon: 'solar:window-frame-bold-duotone',
            },
            {
              name: 'Appointments',
              href: '/dashboard/appointments',
              icon: 'solar:calendar-bold-duotone',
            },
            {
              name: 'Users',
              href: '/dashboard/users',
              icon: 'solar:users-group-rounded-bold-duotone',
            },
            {
              name: 'Drugs',
              href: '/dashboard/drugs',
              icon: 'solar:pills-bold-duotone',
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
            },
            {
              name: 'Settings',
              href: '/dashboard/admin/settings',
              icon: 'solar:settings-bold-duotone',
            },
          ],
        },
      ],
    },
    {
      name: 'Appointments',
      href: '/appointments',
      thumbnail: '/assets/navbar/appointments.png',
      subItems: [
        {
          title: 'Appointments',
          items: [
            {
              name: 'Create New',
              href: '/appointments/create',
              icon: 'solar:pen-new-round-bold-duotone',
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
            },
            {
              name: 'All Appointments',
              href: '/appointments',
              icon: 'solar:clipboard-list-bold-duotone',
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
  ],
  doctor: [
    {
      name: 'Home',
      href: '/home',
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      thumbnail: '/assets/navbar/dashboard.webp',
      subItems: [
        {
          title: 'My Dashboard',
          items: [
            {
              name: 'Overview',
              href: '/dashboard',
              icon: 'solar:window-frame-bold-duotone',
            },
            {
              name: 'Available Slots',
              href: '/dashboard/doctors/slots',
              icon: 'solar:calendar-bold-duotone',
            },
            {
              name: 'Drugs',
              href: '/dashboard/drugs',
              icon: 'solar:pills-bold-duotone',
            },
          ],
        },
      ],
    },
    {
      name: 'Appointments',
      href: '/appointments',
      thumbnail: '/assets/navbar/appointments.png',
      subItems: [
        {
          title: 'My Appointments',
          items: [
            {
              name: 'My Schedules',
              href: '/appointments?view=schedule',
              icon: 'solar:calendar-bold-duotone',
            },
            {
              name: 'All Appointments',
              href: '/appointments',
              icon: 'solar:clipboard-list-bold-duotone',
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
  ],
  receptionist: [
    {
      name: 'Home',
      href: '/home',
    },
    {
      name: 'Appointments',
      href: '/appointments',
      thumbnail: '/assets/navbar/appointments.png',
      subItems: [
        {
          title: 'Appointments',
          items: [
            {
              name: 'Create New',
              href: '/appointments/create',
              icon: 'solar:pen-new-round-bold-duotone',
            },
          ],
        },
        {
          title: 'My Appointments',
          items: [
            {
              name: 'All Appointments',
              href: '/appointments',
              icon: 'solar:clipboard-list-bold-duotone',
            },
          ],
        },
      ],
    },
  ],
  nurse: [
    {
      name: 'Home',
      href: '/home',
    },
  ],
  pharmacist: [
    {
      name: 'Home',
      href: '/home',
    },
  ],
  patient: [
    {
      name: 'Home',
      href: '/home',
    },
    {
      name: 'Appointments',
      href: '/appointments',
      thumbnail: '/assets/navbar/appointments.png',
    },
  ],
};

export const defaultItems: NavItem[] = [
  {
    name: 'Home',
    href: '/home',
  },
  {
    name: 'Products',
    href: '/products',
    thumbnail: '/assets/navbar/appointments-1.png',
    subItems: [
      {
        title: 'Clinic Operations',
        items: [
          {
            name: 'Pharmacy & Billing',
            href: '/products/inventory',
            icon: 'solar:bill-list-bold-duotone',
            description: 'Manage prescriptions and billing',
          },
          {
            name: 'Reporting & Analytics',
            href: '/products/inventory',
            icon: 'solar:graph-new-bold-duotone',
            description: 'View reports and performance stats',
          },
          {
            name: 'Staff Management',
            href: '/products/inventory',
            icon: 'solar:users-group-rounded-bold-duotone',
            description: 'Manage doctors and hospital staff',
          },
          {
            name: 'Laboratory Management',
            href: '/products/inventory',
            icon: 'solar:test-tube-bold-duotone',
            description: 'Handle lab tests and results',
          },
        ],
      },
      {
        title: 'Patient Care',
        items: [
          {
            name: 'Appointment Management	',
            href: '/products/appointments',
            icon: 'solar:calendar-bold-duotone',
            description: 'Book and manage appointments',
          },
          {
            name: 'Patient Records',
            href: '/products/inventory',
            icon: 'solar:user-hands-bold-duotone',
            description: 'Store and access patient records',
          },
          {
            name: 'Reminders',
            href: '/products/inventory',
            icon: 'solar:notification-unread-lines-bold-duotone',
            description: 'Send reminders and alerts',
          },
        ],
      },
    ],
  },
  {
    name: 'Solutions',
    href: '/appointments',
    thumbnail: '/assets/navbar/appointments.png',
    subItems: [
      {
        items: [
          {
            name: 'Multi-Clinic Support',
            href: '/appointments/create',
            icon: 'solar:branching-paths-down-bold-duotone',
            description: 'Manage multiple branches easily',
          },
          {
            name: 'Role-Based Access',
            href: '/appointments/create',
            icon: 'solar:user-cross-bold-duotone',
            description: 'Secure user role permissions',
          },
          {
            name: 'Shift & Attendance',
            href: '/appointments/create',
            icon: 'solar:medal-ribbon-star-bold-duotone',
            description: 'Track staff shifts and attendance',
          },
          {
            name: 'Payroll Integration',
            href: '/appointments/create',
            icon: 'solar:wallet-money-bold-duotone',
            description: 'Connect payroll and HR systems',
          },
        ],
      },
      {
        items: [
          {
            name: 'AI-Powered Insights',
            href: '/appointments/create',
            icon: 'solar:presentation-graph-bold-duotone',
            description: 'Get real-time analytics and recommendations',
          },
          {
            name: 'Custom Branding',
            href: '/appointments/create',
            icon: 'solar:colour-tuneing-bold-duotone',
            description: 'Personalize platform for your clinic',
          },
        ],
      },
    ],
  },
  {
    name: 'About Us',
    href: '/appointments',
    thumbnail: '/assets/navbar/appointments.png',
    subItems: [
      {
        title: 'Appointments',
        items: [
          {
            name: 'Create New',
            href: '/appointments/create',
            icon: 'solar:pen-new-round-linear',
          },
        ],
      },
    ],
  },
  {
    name: 'Pricing',
    href: '/appointments',
  },
  {
    name: 'Contact Us',
    href: '/appointments',
  },
];
