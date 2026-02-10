'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useSession } from '@/libs/providers/session-provider';
import {
  Button,
  Link,
  Listbox,
  ListboxItem,
  Navbar as NextNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react/dist/iconify.js';

import { navItems } from './data';
import NavItem from './NavItem';
import { NavItem as NavItemType } from './types';

import { useSubdomain } from '@/hooks/useSubDomain';
import { APP_INFO } from '@/libs/config';
import { Role } from '@/services/common/user/user.constants';
import NotificationsWrapper from './notifications';
import ProfileDropdown from './profile-dropdown';

// Utility function to filter nav items by user role
const filterNavItemsByRole = (items: NavItemType[], userRole?: Role): NavItemType[] => {
  if (!userRole) return items;

  return items
    .filter((item) => {
      // If item has no roles specified, show it to everyone
      if (!item.roles) return true;
      // Check if user role is in the allowed roles
      return item.roles.includes(userRole);
    })
    .map((item) => {
      // If item has subItems, filter them too
      if (item.subItems) {
        const filteredSubItems = item.subItems
          .map((subItem) => ({
            ...subItem,
            items: subItem.items.filter((subMenuItem) => {
              // If subMenuItem has no roles specified, show it to everyone
              if (!subMenuItem.roles) return true;
              // Check if user role is in the allowed roles
              return subMenuItem.roles.includes(userRole);
            }),
          }))
          .filter((subItem) => subItem.items.length > 0); // Remove empty subItems

        return {
          ...item,
          subItems: filteredSubItems,
        };
      }
      return item;
    });
};

export default function Navbar() {
  const router = useRouter();
  const { user } = useSession();
  const subdomain = useSubdomain();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<null | NavItemType>(null);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const DISABLED_PATHS = ['/auth', '/dashboard'];
  const pathname = usePathname();
  const isDisabled = DISABLED_PATHS.some((path) => pathname.startsWith(path));

  // Filter nav items based on user role
  const filteredNavItems = filterNavItemsByRole(navItems, user?.role);

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

  if (isDisabled) return null;

  return (
    <NextNavbar
      isBordered
      classNames={{
        base: 'border-divider-100',
        wrapper: 'w-full justify-center bg-transparent',
        item: 'hidden md:flex',
      }}
      height="56px"
      isMenuOpen={!!(isMenuOpen || activeMenu)}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
    >
      <NavbarMenuToggle className="text-default-400 md:hidden" />

      <NavbarBrand>
        <Link className="text-foreground text-large ml-2 font-medium" href="/">
          {APP_INFO.name}
          <span className="text-primary text-tiny ml-1 uppercase">{subdomain}</span>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden h-11 gap-4 px-4 md:flex" justify="center">
        {filteredNavItems.map((item, index) => (
          <NavItem
            key={`${item.name}-${index}`}
            item={item}
            index={index}
            onMouseEnter={() => {
              clearTimeoutRef();
              timeoutRef.current = setTimeout(() => {
                setActiveMenu(item);
              }, 200);
            }}
            onMouseLeave={() => {
              startCloseTimeout();
            }}
          />
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        {!!user && (
          <NavbarItem className="flex">
            <NotificationsWrapper />
          </NavbarItem>
        )}
        <NavbarItem className="flex! ml-2 gap-2">
          {user ? (
            <ProfileDropdown />
          ) : (
            <Button
              onPress={() => router.push('/auth/login')}
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
        className="bg-default-200/50 top-[calc(var(--navbar-height)-1px)] max-h-[80vh] pt-6 shadow-xl backdrop-blur-md backdrop-saturate-150 md:hidden md:max-h-[30vh]"
        motionProps={{
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: {
            ease: 'easeInOut',
            duration: 0.2,
          },
        }}
      >
        {filteredNavItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link className="text-default-500 w-full" href={item.href} size="md">
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      <NavbarMenu
        className="rounded-large bg-default-200/80 top-[calc(var(--navbar-height)+8px)] mx-auto hidden max-h-72 max-w-4xl py-6 shadow-xl backdrop-blur-md backdrop-saturate-150 md:flex"
        onMouseEnter={clearTimeoutRef}
        onMouseLeave={startCloseTimeout}
        motionProps={{
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: {
            ease: 'easeInOut',
            duration: 0.2,
          },
        }}
      >
        {activeMenu && activeMenu.subItems && (
          <div className="grid h-full w-full grid-cols-10 justify-between gap-2">
            <div className="col-span-6 grid grid-cols-2">
              {activeMenu.subItems.map((subItem, idx) => (
                <div key={`${subItem.title}-${idx}`}>
                  <motion.h3
                    className="text-default-500 text-tiny mb-4 font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {subItem.title}
                  </motion.h3>
                  <Listbox aria-label={subItem.title}>
                    {subItem.items.map((subMenuItem, index) => (
                      <ListboxItem
                        className="text-default-500 pl-2 pr-4"
                        key={`${subMenuItem.name}-${index}`}
                        startContent={
                          subMenuItem?.icon && (
                            <Icon
                              icon={subMenuItem?.icon}
                              width={24}
                              className="text-primary-500"
                            />
                          )
                        }
                        description={
                          'description' in subMenuItem && subMenuItem.description ? (
                            <span className="line-clamp-1 max-w-[50ch]">
                              {(subMenuItem as { description: string }).description}
                            </span>
                          ) : null
                        }
                        onPress={() => {
                          router.push(subMenuItem.href);
                          setTimeout(() => {
                            setActiveMenu(null);
                          }, 200);
                        }}
                        classNames={{
                          title:
                            'description' in subMenuItem && subMenuItem.description
                              ? 'text-foreground'
                              : 'text-default-500',
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
                backgroundImage: `url(${activeMenu.thumbnail})`,
              }}
              className="rounded-medium text-default-500 bg-linear-to-r col-span-4 h-full w-full max-w-sm from-[#F2F0FF] to-[#F0F6FF] bg-cover p-4"
            />
          </div>
        )}
      </NavbarMenu>
    </NextNavbar>
  );
}
