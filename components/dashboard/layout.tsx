'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs as NextUIBreadcrumbs,
  Button,
  cn,
  ScrollShadow,
  Spacer,
  Tooltip,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import Logo from '../ui/logo';

import Sidebar from '@/components/dashboard/sidebar/sidebar';
import { sectionItemsWithTeams } from '@/components/dashboard/sidebar/sidebar-items';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { User } from 'better-auth';

export default function DashboardLayout({
  children,
  sessionUser,
}: {
  readonly children: React.ReactNode;
  sessionUser: User;
}) {
  const [isHidden, setIsHidden] = useLocalStorage('isDashboardSidebarHidden', true);

  const pathname = usePathname();
  const currentPath = pathname.split('/')?.[2];

  const pathSegments = pathname?.split('/').filter((segment) => segment !== '');

  const breadcrumbItems = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return { label: segment, link: path };
  });

  const sidebar = useMemo(
    () => (
      <div
        className={cn(
          'relative flex h-full w-72 max-w-[288px] flex-1 flex-col !border-r-small border-divider transition-all duration-250 ease-in-out',
          {
            'max-w-16': isHidden,
          }
        )}
      >
        <div
          className={cn('flex flex-col gap-4 py-2 pl-2', {
            'px-2': !isHidden,
          })}
        >
          <Link href="/">
            <Logo isCompact={isHidden} />
          </Link>
        </div>

        <ScrollShadow hideScrollBar className="h-full max-h-full pl-2">
          <Sidebar
            defaultSelectedKey="dashboard"
            items={sectionItemsWithTeams}
            selectedKeys={[currentPath || 'dashboard']}
            isCompact={isHidden}
          />
        </ScrollShadow>
        <Spacer y={8} />
        <div
          className={cn('flex flex-col items-center gap-1 pb-4 pl-2', {
            'px-2': !isHidden,
          })}
        >
          <Tooltip isDisabled={!isHidden} content="Profile" placement="right">
            <Button
              aria-label="Profile"
              fullWidth
              className={cn('justify-center text-default-500', {
                'justify-start text-foreground': !isHidden,
              })}
              startContent={
                <Avatar src={sessionUser.image || ''} name={sessionUser.name || ''} size="sm" />
              }
              variant="light"
              as={Link}
              href="/dashboard/profile"
              isIconOnly={isHidden}
            >
              {!isHidden && 'Profile'}
            </Button>
          </Tooltip>
          <Tooltip isDisabled={!isHidden} color="danger" content="Log Out" placement="right">
            <Button
              aria-label="Log Out"
              fullWidth
              className="justify-start text-default-500 data-[hover=true]:text-danger"
              startContent={
                <Icon className="w-full rotate-180" icon="solar:logout-bold-duotone" width={24} />
              }
              variant="light"
              color="danger"
              onPress={async () => {
                await signOut();
                window.location.href = '/auth/login';
              }}
              isIconOnly={isHidden}
            >
              {!isHidden && 'Log Out'}
            </Button>
          </Tooltip>
        </div>
      </div>
    ),
    [isHidden, currentPath]
  );

  const header = useMemo(
    () => (
      <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4 py-1">
        <Button
          aria-label="Toggle Sidebar"
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => setIsHidden(!isHidden)}
        >
          <Icon
            className="text-default-500"
            height={24}
            icon="solar:sidebar-minimalistic-outline"
            width={24}
          />
        </Button>
        <NextUIBreadcrumbs variant="light">
          {breadcrumbItems?.map((item, index) => (
            <BreadcrumbItem key={index}>
              {index !== breadcrumbItems.length - 1 ? (
                <Link href={item.link} className="capitalize">
                  {item.label}
                </Link>
              ) : (
                <span className="capitalize">{item.label}</span>
              )}
            </BreadcrumbItem>
          ))}
        </NextUIBreadcrumbs>
      </header>
    ),
    [breadcrumbItems, isHidden]
  );

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {sidebar}
      <div className="w-[80vw] flex-1 flex-col md:p-2">
        {header}
        <main className="h-full w-full overflow-visible">
          <div className="flex h-[93vh] flex-col gap-4 overflow-hidden p-2">{children}</div>
        </main>
      </div>
    </div>
  );
}
