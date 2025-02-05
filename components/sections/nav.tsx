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
import type { NavbarProps } from '@heroui/react';

const menuItems = [
  {
    name: 'Home',
    href: '/home'
  },
  {
    name: 'Dashboard',
    href: '/dashboard'
  },
  {
    name: 'Appointments',
    href: '/appointments'
  },
  {
    name: 'About Us',
    href: '#'
  },
  {
    name: 'Integrations',
    href: '#'
  }
];

export default function Nav({ session }: { session: any }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const DISABLED_PATHS = ['/auth', '/dashboard'];

  const pathname = usePathname();
  const isDisabled = DISABLED_PATHS.some((path) => pathname.startsWith(path));

  if (isDisabled) return null;
  return (
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
      isMenuOpen={isMenuOpen}
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
          <NavbarItem key={`${item}-${index}`}>
            <Link className="text-default-500" href={item.href} size="sm">
              {item.name}
            </Link>
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
                <DropdownItem key="configurations">Configurations</DropdownItem>
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
        className="top-[calc(var(--navbar-height)_-_1px)] max-h-[70vh] bg-default-200/50 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150"
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
          <NavbarMenuItem key={`${item}-${index}`}>
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
    </Navbar>
  );
}
