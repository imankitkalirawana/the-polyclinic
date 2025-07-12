import { type SidebarItem } from './sidebar';

import ModeToggle from '@/components/mode-toggle';

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
export const sectionItemsWithTeams: SidebarItem[] = [...sectionItems];
