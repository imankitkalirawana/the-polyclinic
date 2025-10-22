'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/providers/session-provider';
import {
  BreadcrumbItem,
  Breadcrumbs as NextUIBreadcrumbs,
  Button,
  cn,
  ScrollShadow,
  Input,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import Logo from '../ui/logo';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getSidebarItems } from '@/components/dashboard/sidebar/sidebar-items';
import Sidebar from '@/components/dashboard/sidebar/sidebar';
import NotificationsWrapper from '../sections/navbar/notifications';
import ProfileDropdown from '../sections/navbar/profile-dropdown';

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  const { user } = useSession();

  const [isHidden, setIsHidden] = useLocalStorage('isDashboardSidebarHidden', true);

  const pathname = usePathname();
  const currentPath = pathname.split('/')?.[2];

  const pathSegments = pathname?.split('/').filter((segment) => segment !== '');

  const breadcrumbItems = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return { label: segment, link: path };
  });

  const sidebar = useMemo(() => {
    if (!user) return null;

    // Filter sidebar items based on user role
    const filteredItems = getSidebarItems(user?.role);

    return (
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
      <header className="flex items-center justify-between gap-3 p-2 py-1">
        <div className="flex items-center gap-3 rounded-medium bg-default-200 px-3 py-1">
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
      <div className="flex w-[80vw] flex-1 flex-col md:p-2">
        {header}
        <main className="w-full flex-1 overflow-hidden">
          <div className="flex h-full flex-col gap-4 overflow-hidden p-2">{children}</div>
        </main>
      </div>
    </div>
  );
}
