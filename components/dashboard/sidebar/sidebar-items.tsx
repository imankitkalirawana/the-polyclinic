import { UnifiedUser } from '@/services/common/user';
import { type SidebarItem, SidebarItemType } from './sidebar';

// Extend SidebarItem to include roles

export const sectionItems: SidebarItem[] = [
  {
    key: 'overview',
    title: 'Overview',
    items: [
      {
        key: 'dashboard',
        href: '/dashboard',
        icon: 'solar:home-2-bold-duotone',
        title: 'Home',
        roles: ['superadmin', 'moderator', 'ops', 'ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'],
      },
      {
        key: 'appointments',
        type: SidebarItemType.Nest,
        icon: 'solar:calendar-bold-duotone',
        title: 'Appointments',
        roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'],
        items: [
          {
            key: 'book-appointment',
            href: '/dashboard/appointments/create',
            title: 'New Appointment',
            roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'],
          },
          {
            key: 'all-appointments',
            href: '/dashboard/appointments?view=month',
            title: 'All Appointments',
            roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'],
          },
        ],
      },
      {
        key: 'queues',
        type: SidebarItemType.Nest,
        icon: 'ph:coins-duotone',
        title: 'Token Appointments',
        roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'],
        items: [
          {
            key: 'book-queue',
            href: '/dashboard/queues/new',
            title: 'Book New Appointment',
            roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'],
          },
          {
            key: 'all-queues',
            href: '/dashboard/queues',
            title: 'All Appointments',
            roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'],
          },
        ],
      },
      {
        key: 'analytics',
        href: '/dashboard/analytics',
        icon: 'solar:graph-bold-duotone',
        title: 'Analytics',
        roles: ['superadmin', 'ADMIN'],
      },
    ],
  },
  {
    key: 'people',
    title: 'People',
    items: [
      {
        key: 'users',
        href: '/dashboard/users',
        icon: 'solar:users-group-rounded-bold-duotone',
        title: 'Users',
        roles: ['superadmin', 'moderator', 'ops', 'ADMIN', 'RECEPTIONIST'],
      },
      {
        key: 'patients',
        href: '/dashboard/patients',
        icon: 'solar:user-heart-bold-duotone',
        title: 'Patients',
        roles: ['ADMIN', 'RECEPTIONIST'],
      },
      {
        key: 'doctors',
        href: '/dashboard/doctors',
        icon: 'solar:stethoscope-bold-duotone',
        title: 'Doctors',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    key: 'organization',
    title: 'Organization',
    items: [
      {
        key: 'manage-organization',
        href: '/dashboard/organization',
        icon: 'solar:buildings-bold-duotone',
        title: 'Manage Organization',
        roles: ['ADMIN'],
      },
      {
        key: 'services',
        href: '/dashboard/services',
        icon: 'solar:test-tube-minimalistic-bold-duotone',
        title: 'Services',
        roles: ['ADMIN'],
      },
      {
        key: 'drugs',
        href: '/dashboard/drugs',
        icon: 'solar:pills-bold-duotone',
        title: 'Drugs',
        roles: ['ADMIN'],
      },
      {
        key: 'departments',
        href: '/dashboard/departments',
        icon: 'solar:hospital-bold-duotone',
        title: 'Departments',
        roles: ['ADMIN', 'RECEPTIONIST', 'PATIENT', 'DOCTOR'],
      },
    ],
  },
  {
    key: 'system',
    title: 'System',
    items: [
      {
        key: 'organizations',
        href: '/dashboard/organizations',
        icon: 'solar:buildings-bold-duotone',
        title: 'Organizations',
        roles: ['superadmin', 'moderator', 'ops'],
      },
      {
        key: 'website',
        href: '/dashboard/website',
        icon: 'solar:card-bold-duotone',
        title: 'Website',
        roles: ['superadmin'],
      },
      {
        key: 'emails',
        href: '/dashboard/emails',
        icon: 'solar:letter-bold-duotone',
        title: 'Emails',
        roles: ['superadmin', 'moderator'],
      },
      {
        key: 'newsletters',
        href: '/dashboard/newsletters',
        icon: 'solar:inbox-bold-duotone',
        title: 'Newsletters',
        roles: ['superadmin'],
      },
    ],
  },
  // {
  //   key: 'configure',
  //   title: 'Configure',
  //   items: [
  //     {
  //       key: 'theme',
  //       href: undefined,
  //       icon: 'solar:moon-fog-bold-duotone',
  //       title: 'Dark Mode',
  //       endContent: <ThemeSwitcher />,
  //     },
  //   ],
  // },
];

// Function to filter sidebar items based on user role
export const getSidebarItems = (userRole?: UnifiedUser['role'] | null): SidebarItem[] => {
  if (!userRole) {
    return [];
  }

  return sectionItems
    .map((section) => ({
      ...section,
      items: section.items?.filter((item) => {
        // If no roles specified, show to all users
        if (!item.roles || item.roles.length === 0) {
          return true;
        }
        // If roles specified, check if user has one of the required roles
        return item.roles.includes(userRole);
      }),
    }))
    .filter((section) => section.items && section.items.length > 0);
};
