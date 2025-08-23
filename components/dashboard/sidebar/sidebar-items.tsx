import { type SidebarItem } from './sidebar';

import ModeToggle from '@/components/mode-toggle';

// Extend SidebarItem to include roles
export interface SidebarItemWithRoles extends SidebarItem {
  roles?: string[];
  items?: SidebarItemWithRoles[];
}

export const sectionItems: SidebarItemWithRoles[] = [
  {
    key: 'overview',
    title: 'Overview',
    items: [
      {
        key: 'dashboard',
        href: '/dashboard',
        icon: 'solar:home-2-bold-duotone',
        title: 'Home',
      },
      {
        key: 'organizations',
        href: '/dashboard/organizations',
        icon: 'solar:buildings-bold-duotone',
        title: 'Organizations',
        roles: ['superadmin'],
      },
      {
        key: 'users',
        href: '/dashboard/users',
        icon: 'solar:users-group-rounded-bold-duotone',
        title: 'Users',
      },
      {
        key: 'doctors',
        href: '/dashboard/doctors',
        icon: 'solar:stethoscope-bold-duotone',
        title: 'Doctors',
      },
      {
        key: 'appointments',
        href: '/dashboard/appointments',
        icon: 'solar:calendar-bold-duotone',
        title: 'Appointments',
      },
      {
        key: 'services',
        href: '/dashboard/services',
        icon: 'solar:test-tube-minimalistic-bold-duotone',
        title: 'Services',
      },
      {
        key: 'drugs',
        href: '/dashboard/drugs',
        icon: 'solar:pills-bold-duotone',
        title: 'Drugs',
      },
      {
        key: 'emails',
        href: '/dashboard/emails',
        icon: 'solar:letter-bold-duotone',
        title: 'Emails',
      },
      {
        key: 'newsletters',
        href: '/dashboard/newsletters',
        icon: 'solar:inbox-bold-duotone',
        title: 'Newsletters',
      },
      {
        key: 'website',
        href: '/dashboard/website',
        icon: 'solar:card-bold-duotone',
        title: 'Website',
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
        endContent: <ModeToggle />,
      },
    ],
  },
];
export const sectionItemsWithTeams: SidebarItemWithRoles[] = [...sectionItems];

// Function to filter sidebar items based on user role
export const filterSidebarItemsByRole = (
  items: SidebarItemWithRoles[],
  userRole: string
): SidebarItemWithRoles[] => {
  return items
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
