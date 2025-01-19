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
  Image
} from "@heroui/react";
import { usePathname } from 'next/navigation';
import ModeToggle from '../mode-toggle';
import ProfileDropdown from './profile-dropdown';

interface NavbarProps {
  session: any;
}

const menuItems = [
  {
    name: 'Home',
    href: '/'
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const DISABLED_PATHS = ['/auth', '/dashboard'];

  const pathname = usePathname();
  const isDisabled = DISABLED_PATHS.some((path) => pathname.startsWith(path));

  if (isDisabled) return null;

  return (
    <NextNavbar
      classNames={{
        base: 'py-4 backdrop-filter-none bg-transparent',
        wrapper: 'px-0 w-full justify-center bg-transparent',
        item: 'hidden md:flex'
      }}
      className="fixed top-0 bg-transparent backdrop-filter-none"
      height="54px"
    >
      <NavbarContent
        className="gap-4 rounded-full border-small border-default-200/20 bg-background/70 px-2 shadow-medium backdrop-blur-lg backdrop-saturate-150"
        justify="center"
      >
        {/* Toggle */}
        <NavbarMenuToggle className="ml-2 text-default-400 md:hidden" />

        {/* Logo */}
        <NavbarBrand className="mr-2 w-[40vw] md:w-auto md:max-w-fit">
          <div className="rounded-full bg-foreground text-background">
            <Image isBlurred src="/logo.png" width={36} />
          </div>
          <span className="ml-2 font-medium">Devocode</span>
        </NavbarBrand>

        {/* Items */}
        {menuItems.map((item, index) => (
          <NavbarItem
            key={`desktop-${item.name}-${index}`}
            className="hidden md:flex"
          >
            <Link className="text-default-700" href={item.href} size="sm">
              {item.name}
            </Link>
          </NavbarItem>
        ))}

        <NavbarItem>
          {session ? (
            <ProfileDropdown session={session} />
          ) : (
            <Button as={Link} href="/auth/login" radius="lg" variant="flat">
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Menu */}
      <NavbarMenu
        className="top-[calc(var(--navbar-height)/2)] mx-auto mt-16 max-h-[40vh] max-w-[80vw] rounded-large border-small border-default-200/20 bg-background/60 py-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
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
          <NavbarMenuItem key={`mobile-${item.name}-${index}`}>
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
    </NextNavbar>
  );
}
