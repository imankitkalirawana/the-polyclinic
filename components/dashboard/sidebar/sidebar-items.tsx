import { type SidebarItem, SidebarItemType } from './sidebar';
import { Role } from '@/services/common/user/user.constants';

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
        roles: [...Object.values(Role)],
      },
      {
        key: 'appointments',
        type: SidebarItemType.Nest,
        icon: 'solar:calendar-bold-duotone',
        title: 'Appointments',
        roles: [Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.PATIENT],
        items: [
          {
            key: 'book-appointment',
            href: '/dashboard/appointments/create',
            title: 'New Appointment',
            roles: [Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.PATIENT],
          },
          {
            key: 'all-appointments',
            href: '/dashboard/appointments?view=month',
            title: 'All Appointments',
            roles: [Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.PATIENT],
          },
        ],
      },
      {
        key: 'queues',
        type: SidebarItemType.Nest,
        icon: 'ph:coins-duotone',
        title: 'Token Appointments',
        roles: [Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.PATIENT],
        items: [
          {
            key: 'book-queue',
            href: '/dashboard/queues/new',
            title: 'Book New Appointment',
            roles: [Role.ADMIN, Role.RECEPTIONIST, Role.PATIENT],
          },
          {
            key: 'all-queues',
            href: '/dashboard/queues',
            title: 'All Appointments',
            roles: [Role.ADMIN, Role.RECEPTIONIST, Role.PATIENT],
          },
          {
            key: 'scheduled-queues-doctor',
            href: '/dashboard/queues?view=scheduled',
            title: 'Scheduled Appointments',
            roles: [Role.DOCTOR],
          },
          {
            key: 'all-queues-doctor',
            href: '/dashboard/queues?view=all',
            title: 'All Appointments',
            roles: [Role.DOCTOR],
          },
        ],
      },
      {
        key: 'analytics',
        href: '/dashboard/analytics',
        icon: 'solar:graph-bold-duotone',
        title: 'Analytics',
        roles: [Role.ADMIN],
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
        roles: [Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR],
      },
      {
        key: 'patients',
        href: '/dashboard/patients',
        icon: 'solar:user-heart-bold-duotone',
        title: 'Patients',
        roles: [Role.ADMIN, Role.RECEPTIONIST],
      },
      {
        key: 'doctors',
        href: '/dashboard/doctors',
        icon: 'solar:stethoscope-bold-duotone',
        title: 'Doctors',
        roles: [Role.ADMIN, Role.RECEPTIONIST, Role.PATIENT],
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
        roles: [Role.ADMIN],
      },
      {
        key: 'services',
        href: '/dashboard/services',
        icon: 'solar:test-tube-minimalistic-bold-duotone',
        title: 'Services',
        roles: [Role.ADMIN],
      },
      {
        key: 'drugs',
        href: '/dashboard/drugs',
        icon: 'solar:pills-bold-duotone',
        title: 'Drugs',
        roles: [Role.ADMIN],
      },
      {
        key: 'departments',
        href: '/dashboard/departments',
        icon: 'solar:hospital-bold-duotone',
        title: 'Departments',
        roles: [Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.PATIENT],
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
        roles: [Role.ADMIN],
      },
      {
        key: 'website',
        href: '/dashboard/website',
        icon: 'solar:card-bold-duotone',
        title: 'Website',
        roles: [Role.ADMIN],
      },
      {
        key: 'emails',
        href: '/dashboard/emails',
        icon: 'solar:letter-bold-duotone',
        title: 'Emails',
        roles: [Role.ADMIN],
      },
      {
        key: 'newsletters',
        href: '/dashboard/newsletters',
        icon: 'solar:inbox-bold-duotone',
        title: 'Newsletters',
        roles: [Role.ADMIN],
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

// Helper function to filter a single item and its nested items recursively
const filterItem = (item: SidebarItem, userRole: Role): SidebarItem | null => {
  // Check if user has access to this item
  const hasAccess = !item.roles || item.roles.length === 0 || item.roles.includes(userRole);

  if (!hasAccess) {
    return null;
  }

  // If item has nested items, recursively filter them
  if (item.items && item.items.length > 0) {
    const filteredNestedItems = item.items
      .map((nestedItem) => filterItem(nestedItem, userRole))
      .filter((item): item is SidebarItem => item !== null);

    // If no nested items are visible, hide the parent item
    if (filteredNestedItems.length === 0) {
      return null;
    }

    // Return item with filtered nested items
    return {
      ...item,
      items: filteredNestedItems,
    };
  }

  // Return item as-is if no nested items
  return item;
};

// Function to filter sidebar items based on user role
export const getSidebarItems = (userRole?: Role | null): SidebarItem[] => {
  if (!userRole) {
    return [];
  }

  return sectionItems
    .map((section) => ({
      ...section,
      items: section.items
        ?.map((item) => filterItem(item, userRole))
        .filter((item): item is SidebarItem => item !== null),
    }))
    .filter((section) => section.items && section.items.length > 0);
};
