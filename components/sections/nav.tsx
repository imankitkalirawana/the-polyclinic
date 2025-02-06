'use client';

import React from 'react';
import {
  Navbar,
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
  DropdownTrigger
} from '@heroui/react';
import { usePathname } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import ModeToggle from '../mode-toggle';
import { motion } from 'framer-motion';

export default function Nav({ session }: { session: any }) {
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
    }, 200);
  };

  const menuItems = [
    {
      name: 'Home',
      href: '/home'
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      subItems: [
        {
          title: 'My Dashboard',
          items: [
            { name: 'Overview', href: '/dashboard/overview' },
            { name: 'Stats', href: '/dashboard/stats' },
            { name: 'Settings', href: '/dashboard/settings' }
          ]
        },
        {
          title: 'Admin Dashboard',
          items: [
            { name: 'Overview', href: '/dashboard/admin/overview' },
            { name: 'Stats', href: '/dashboard/admin/stats' },
            { name: 'Settings', href: '/dashboard/admin/settings' }
          ]
        }
      ]
    },
    {
      name: 'Appointments',
      href: '/appointments',
      subItems: [
        {
          title: 'Appointments',
          items: [{ name: 'Create New', href: '/appointments/new' }]
        },
        {
          title: 'My Appointments',
          items: [
            { name: 'Upcoming', href: '/appointments' },
            { name: 'Overdue', href: '/appointments?status=overdue' },
            { name: 'Past', href: '/appointments?status=past' },
            { name: 'All Appointments', href: '/appointments?status=all' }
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
      <Navbar
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
                  {item.name}
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
                    <p className="text-xs text-default-500">Signed in as</p>
                    <p className="font-semibold">{session.user.name}</p>
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
          className="top-[calc(var(--navbar-height)_-_1px)] max-h-[80vh] bg-default-200/50 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 md:hidden md:max-h-[30vh]"
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
          className="top-[calc(var(--navbar-height)_-_1px)] hidden bg-default-200/80 pt-6 shadow-medium backdrop-blur-xl backdrop-saturate-150 md:flex md:max-h-fit md:min-h-[30vh]"
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
            <div className="mx-auto flex w-full max-w-[78rem] gap-8 px-4 py-2 lg:gap-16">
              {activeMenu.subItems.map((subItem, idx) => (
                <div key={`${subItem.title}-${idx}`}>
                  <motion.h3
                    className="mb-4 text-xs font-light text-default-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {subItem.title}
                  </motion.h3>
                  <motion.div
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {subItem.items.map((subMenuItem, index) => (
                      <div
                        className="flex items-center gap-1"
                        key={`${subMenuItem.name}-${index}`}
                      >
                        <Link
                          key={`${subMenuItem.name}-${index}`}
                          href={subMenuItem.href}
                          className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                          onPress={() => {
                            // wait for 200ms before closing the sub-menu
                            setTimeout(() => {
                              setActiveMenu(null);
                            }, 200);
                          }}
                        >
                          {subMenuItem.name}
                        </Link>
                      </div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </NavbarMenu>
      </Navbar>
    </>
  );
}
