import { UnifiedUser } from '@/services/common/user';
import { type SidebarItem } from './sidebar';
import { ThemeSwitcher } from '@/components/theme-switcher';

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
        roles: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist', 'doctor', 'patient'],
      },
      {
        key: 'organizations',
        href: '/dashboard/organizations',
        icon: 'solar:buildings-bold-duotone',
        title: 'Organizations',
        roles: ['superadmin', 'moderator', 'ops'],
      },
      {
        key: 'users',
        href: '/dashboard/users',
        icon: 'solar:users-group-rounded-bold-duotone',
        title: 'Users',
        roles: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist'],
      },
      {
        key: 'patients',
        href: '/dashboard/patients',
        icon: 'solar:user-heart-bold-duotone',
        title: 'Patients',
        roles: ['admin', 'receptionist'],
      },
      {
        key: 'doctors',
        href: '/dashboard/doctors',
        icon: 'solar:stethoscope-bold-duotone',
        title: 'Doctors',
        roles: ['admin'],
      },
      {
        key: 'appointments',
        href: '/dashboard/appointments',
        icon: 'solar:calendar-bold-duotone',
        title: 'Appointments',
        roles: ['admin', 'receptionist', 'doctor', 'patient'],
      },
      {
        key: 'services',
        href: '/dashboard/services',
        icon: 'solar:test-tube-minimalistic-bold-duotone',
        title: 'Services',
        roles: ['admin'],
      },
      {
        key: 'drugs',
        href: '/dashboard/drugs',
        icon: 'solar:pills-bold-duotone',
        title: 'Drugs',
        roles: ['admin'],
      },
      {
        key: 'emails',
        href: '/dashboard/emails',
        icon: 'solar:letter-bold-duotone',
        title: 'Emails',
        roles: ['admin'],
      },
      {
        key: 'newsletters',
        href: '/dashboard/newsletters',
        icon: 'solar:inbox-bold-duotone',
        title: 'Newsletters',
        roles: ['admin'],
      },
      {
        key: 'website',
        href: '/dashboard/website',
        icon: 'solar:card-bold-duotone',
        title: 'Website',
        roles: ['admin'],
      },
    ],
  },
  {
    key: 'configure',
    title: 'Configure',
    items: [
      {
        key: 'theme',
        href: undefined,
        icon: 'solar:moon-fog-bold-duotone',
        title: 'Dark Mode',
        endContent: <ThemeSwitcher />,
      },
    ],
  },
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
