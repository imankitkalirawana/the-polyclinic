'use client';

import React from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link
} from '@heroui/react';
import { usePathname } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import ModeToggle from '../mode-toggle';

interface NavbarProps {
  session: any;
}

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

export default function Nav({ session }: NavbarProps) {
  const DISABLED_PATHS = ['/auth', '/dashboard'];

  const pathname = usePathname();
  const isDisabled = DISABLED_PATHS.some((path) => pathname.startsWith(path));

  if (isDisabled) return null;
  return (
    <div className="fixed left-0 top-0 z-[999] w-full bg-background/80 px-12 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          {/* <Avatar size="sm" src="/logo.png" /> */}
          <h2 className="font-semibold">The Polyclinic</h2>
        </Link>
        <div>
          <ul className="flex gap-6">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  className="text-sm font-light text-foreground hover:text-primary-500"
                  href={item.href}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {session ? (
          <div className="flex items-center gap-2">
            <h3 className="text-small font-light text-default-500">
              {session.user?.name}
            </h3>
            <Dropdown placement="bottom-end" size="sm">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  src="/assets/placeholder-avatar.jpeg"
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
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
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem
                  color="danger"
                  onPress={() => signOut()}
                  key="help_and_feedback"
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : (
          <Button
            radius="lg"
            color="primary"
            size="sm"
            onPress={() => signIn()}
            className="text-sm"
          >
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
}
