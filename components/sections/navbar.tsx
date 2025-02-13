'use client';

import React from 'react';
import {
  Navbar as NextNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  cn,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem
} from '@heroui/react';
import { usePathname } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import ModeToggle from '../mode-toggle';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';
import { NavItem } from '@/lib/interface';
import { useRouter } from 'nextjs-toploader/app';

export default function Navbar({ session }: { session: any }) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<
    null | (typeof menuItems)[0]
  >(null);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const DISABLED_PATHS = ['/auth', '/dashboard'];
  const pathname = usePathname();
  const isDisabled = DISABLED_PATHS.some((path) => pathname.startsWith(path));

  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startCloseTimeout = () => {
    clearTimeoutRef();
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 500);
  };

  const menuItems: NavItem[] = [
    {
      name: 'Home',
      href: '/home'
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
              icon: 'solar:window-frame-linear'
            },
            {
              name: 'Profile',
              href: '/dashboard/profile',
              icon: 'solar:user-linear'
            },
            {
              name: 'Services',
              href: '/dashboard/services',
              icon: 'solar:test-tube-minimalistic-linear'
            },
            {
              name: 'Users',
              href: '/dashboard/users',
              icon: 'solar:pills-linear'
            }
          ]
        },
        {
          title: 'Admin Dashboard',
          items: [
            {
              name: 'Stats',
              href: '/dashboard/admin/stats',
              icon: 'solar:graph-linear'
            },
            {
              name: 'Settings',
              href: '/dashboard/admin/settings',
              icon: 'solar:settings-linear'
            }
          ]
        }
      ]
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
              href: '/appointments/new',
              icon: 'solar:pen-new-round-linear'
            }
          ]
        },
        {
          title: 'My Appointments',
          items: [
            {
              name: 'Upcoming',
              href: '/appointments',
              icon: 'solar:graph-new-up-linear'
            },
            {
              name: 'Overdue',
              href: '/appointments?status=overdue',
              icon: 'solar:bill-list-linear'
            },
            {
              name: 'Past',
              href: '/appointments?status=past',
              icon: 'solar:bill-list-linear'
            },
            {
              name: 'All Appointments',
              href: '/appointments?status=all',
              icon: 'solar:clipboard-list-linear'
            }
          ]
        }
      ]
    },
    {
      name: 'About Us',
      href: '/about'
    },
    {
      name: 'Integrations',
      href: '/integrations'
    }
  ];

  if (isDisabled) return null;

  return (
    <>
      <NextNavbar
        isBordered
        classNames={{
          base: cn('border-default-100', {
            'bg-default-200/50': isMenuOpen
          }),
          wrapper: 'w-full justify-center bg-transparent',
          item: 'hidden md:flex'
        }}
        height="56px"
        isMenuOpen={isMenuOpen || activeMenu ? true : false}
        // isMenuOpen={true}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="xl"
      >
        <NavbarMenuToggle className="text-default-400 md:hidden" />

        <NavbarBrand>
          <span className="ml-2 font-medium">The Polyclinic</span>
        </NavbarBrand>

        <NavbarContent
          className="hidden h-11 gap-4 px-4 md:flex"
          justify="center"
        >
          {menuItems.map((item, index) => (
            <NavbarItem key={`${item.name}-${index}`}>
              {item.subItems ? (
                <Link
                  // href={item.href}
                  className="cursor-pointer text-sm text-default-500"
                  onMouseEnter={() => {
                    clearTimeoutRef();
                    timeoutRef.current = setTimeout(() => {
                      setActiveMenu(item);
                    }, 200);
                  }}
                  onMouseLeave={() => {
                    startCloseTimeout();
                  }}
                >
                  {item.name} <Icon icon="tabler:chevron-down" />
                </Link>
              ) : (
                <Link className="text-default-500" href={item.href} size="sm">
                  {item.name}
                </Link>
              )}
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="ml-2 !flex gap-2">
            {session ? (
              <Dropdown size="sm" placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    as="button"
                    size="sm"
                    className="transition-transform"
                    src="/assets/placeholder-avatar.jpeg"
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                    key="profile"
                    href="/profile"
                    className="h-14 gap-2"
                  >
                    <p className="font-semibold">{session.user?.name}</p>
                    <p className="text-xs capitalize text-default-500">
                      {session.user?.role}
                    </p>
                  </DropdownItem>
                  <DropdownItem key="dashboard" href="/dashboard">
                    My Dashboard
                  </DropdownItem>
                  <DropdownItem key="appointments" href="/appointments">
                    My Appointments
                  </DropdownItem>
                  <DropdownItem key="theme">
                    <div className="flex items-center justify-between">
                      <span>Dark Mode</span>
                      <ModeToggle />
                    </div>
                  </DropdownItem>
                  <DropdownItem key="system">System</DropdownItem>
                  <DropdownItem key="configurations">
                    Configurations
                  </DropdownItem>
                  <DropdownItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    onPress={() => signOut()}
                    color="danger"
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button
                onPress={() => signIn()}
                radius="full"
                color="primary"
                size="sm"
              >
                Sign In
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu
          className="top-[calc(var(--navbar-height)_-_1px)] max-h-[80vh] bg-default-200/50 pt-6 shadow-xl backdrop-blur-md backdrop-saturate-150 md:hidden md:max-h-[30vh]"
          motionProps={{
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: {
              ease: 'easeInOut',
              duration: 0.2
            }
          }}
        >
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                className="w-full text-default-500"
                href={item.href}
                size="md"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>

        <NavbarMenu
          className="top-[calc(var(--navbar-height)_+_8px)] mx-auto hidden max-h-72 max-w-4xl rounded-3xl bg-default-200/80 py-6 shadow-xl backdrop-blur-md backdrop-saturate-150 md:flex"
          onMouseEnter={clearTimeoutRef}
          onMouseLeave={startCloseTimeout}
          motionProps={{
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: {
              ease: 'easeInOut',
              duration: 0.2
            }
          }}
        >
          {activeMenu && activeMenu.subItems && (
            <div className="flex w-full justify-between gap-8 lg:gap-16">
              <div className="flex gap-8">
                {activeMenu.subItems.map((subItem, idx) => (
                  <div key={`${subItem.title}-${idx}`}>
                    <motion.h3
                      className="mb-4 text-xs font-light text-default-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {subItem.title}
                    </motion.h3>
                    <Listbox>
                      {subItem.items.map((subMenuItem, index) => (
                        <ListboxItem
                          className="pl-2 pr-4 text-default-500"
                          key={`${subMenuItem.name}-${index}`}
                          startContent={
                            subMenuItem?.icon && (
                              <Icon icon={subMenuItem?.icon} width={18} />
                            )
                          }
                          // href={subMenuItem.href}
                          onPress={() => {
                            router.push(subMenuItem.href);
                            setTimeout(() => {
                              setActiveMenu(null);
                            }, 200);
                          }}
                        >
                          {subMenuItem.name}
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                ))}
              </div>
              <div
                style={{
                  backgroundImage: `url(${activeMenu.thumbnail})`
                }}
                className="aspect-[2.1] h-full min-h-48 max-w-sm place-self-end self-end justify-self-end rounded-2xl bg-gradient-to-r from-[#F2F0FF] to-[#F0F6FF] bg-cover p-4 text-default-500"
              ></div>
            </div>
          )}
        </NavbarMenu>
      </NextNavbar>
    </>
  );
}
