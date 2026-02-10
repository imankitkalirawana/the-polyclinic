'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/libs/providers/session-provider';
import {
  BreadcrumbItem,
  Breadcrumbs as NextUIBreadcrumbs,
  Button,
  cn,
  ScrollShadow,
  Input,
  Tooltip,
  Kbd,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import Logo from '../ui/logo';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getSidebarItems } from '@/components/dashboard/sidebar/sidebar-items';
import Sidebar from '@/components/dashboard/sidebar/sidebar';
import NotificationsWrapper from '../sections/navbar/notifications';
import ProfileDropdown from '../sections/navbar/profile-dropdown';
import { ErrorBoundary } from '@sentry/nextjs';
import CustomError from '../error';
import { useKeyPress } from '@/hooks/useKeyPress';

export const SIDEBAR_WIDTHS = {
  expanded: 288,
  collapsed: 64,
};

const MAX_LENGTH = 10;

function formatLongSegment(text: string) {
  return text.length > MAX_LENGTH ? (
    <Tooltip delay={1000} size="sm" content={text}>
      {text.slice(0, MAX_LENGTH / 2) + '...' + text.slice(-MAX_LENGTH / 2)}
    </Tooltip>
  ) : (
    text
  );
}

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  const { user } = useSession();

  const [isHidden, setIsHidden] = useLocalStorage('isDashboardSidebarHidden', true);

  // command + / to toggle sidebar
  useKeyPress(['meta', '/'], () => {
    setIsHidden(!isHidden);
  });

  const pathname = usePathname();
  const currentPath = pathname.split('/')?.[2];

  const pathSegments = pathname?.split('/').filter((segment) => segment !== '');

  const breadcrumbItems = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return { label: formatLongSegment(segment), link: path };
  });

  const sidebar = useMemo(() => {
    if (!user) return null;

    // Filter sidebar items based on user role
    const filteredItems = getSidebarItems(user?.role);

    return (
      <div
        style={{
          width: isHidden ? SIDEBAR_WIDTHS.collapsed : SIDEBAR_WIDTHS.expanded,
          maxWidth: isHidden ? SIDEBAR_WIDTHS.collapsed : SIDEBAR_WIDTHS.expanded,
        }}
        className={cn(
          '!border-r-small border-divider duration-250 relative flex h-full flex-1 flex-col overflow-x-hidden transition-all ease-in-out'
        )}
      >
        <div className="border-divider flex justify-center gap-4 border-b py-2">
          <Button
            data-testid="go-to-homepage-button"
            title="Go to homepage"
            isIconOnly={isHidden}
            as={Link}
            variant="light"
            radius="full"
            href="/"
          >
            <Logo isCompact={isHidden} />
          </Button>
        </div>

        <ScrollShadow hideScrollBar className="h-full max-h-full">
          <Sidebar
            defaultSelectedKey="dashboard"
            items={filteredItems}
            selectedKeys={[currentPath || 'dashboard']}
            isCompact={isHidden}
          />
        </ScrollShadow>
      </div>
    );
  }, [isHidden, currentPath, user?.role]);

  const header = useMemo(
    () => (
      <header
        data-testid="dashboard-header"
        className="border-divider flex items-center justify-between gap-3 border-b p-2"
      >
        <div className="rounded-medium bg-default-200 flex items-center gap-3 px-3 py-1">
          <Tooltip delay={1000} size="sm" content={<Kbd>Cmd + /</Kbd>} placement="bottom">
            <Button
              aria-label="Toggle Sidebar"
              data-testid="toggle-sidebar-button"
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
          </Tooltip>
          <NextUIBreadcrumbs>
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
        </div>
        <div>
          <Input
            aria-label="Search anything..."
            placeholder="Search anything..."
            className="w-64"
            startContent={<Icon icon="heroicons:magnifying-glass-solid" width={18} />}
          />
        </div>
        <div className="flex items-center gap-2">
          <NotificationsWrapper />
          <ProfileDropdown />
        </div>
      </header>
    ),
    [breadcrumbItems, isHidden]
  );

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {sidebar}
      <div className="flex w-[80vw] flex-1 flex-col">
        {header}
        <main className="w-full flex-1 overflow-hidden">
          <div className="flex h-full flex-col gap-4 overflow-hidden">
            <ErrorBoundary fallback={<CustomError type="error" />}>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
