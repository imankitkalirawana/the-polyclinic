'use client';
import { sectionItemsWithTeams } from '@/components/dashboard/sidebar/sidebar-items';
import {
  cn,
  Spacer,
  Avatar,
  ScrollShadow,
  Button,
  Breadcrumbs as NextUIBreadcrumbs,
  BreadcrumbItem
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar/sidebar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({
  children
}: {
  readonly children: React.ReactNode;
}) {
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signOut();
      window.location.href = '/auth/login';
    }
  }, [status, session]);

  const [isHidden, setIsHidden] = useState(false);

  const pathname = usePathname();
  let currentPath = pathname.split('/')?.[2];

  const pathSegments = pathname?.split('/').filter((segment) => segment !== '');

  const breadcrumbItems = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return { label: segment, link: path };
  });

  return (
    <div>
      <div className="flex h-dvh w-full overflow-hidden">
        <div
          className={cn(
            'relative flex h-full w-72 max-w-[288px] flex-1 flex-col !border-r-small border-divider p-6 transition-[transform,opacity,margin] duration-250 ease-in-out',
            {
              '-ml-72 -translate-x-72': isHidden
            }
          )}
        >
          <Spacer y={8} />
          <Link
            href={'/dashboard/profile'}
            className="flex items-center gap-3 rounded-xl p-2 px-3 transition-all hover:bg-default"
          >
            <Avatar
              isBordered
              size="sm"
              //   src="https://i.pravatar.cc/150?u=a04258114e29026708c"
              name={session?.user?.name || 'Anonymous'}
            />
            <div className="flex flex-col">
              <p className="text-small font-medium text-default-600">
                {session?.user?.name}
              </p>
              <p className="text-tiny capitalize text-default-400">
                {session?.user?.role}
              </p>
            </div>
          </Link>
          <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
            <Sidebar
              defaultSelectedKey="home"
              items={sectionItemsWithTeams}
              selectedKeys={[currentPath || 'dashboard']}
            />
          </ScrollShadow>
          <Spacer y={8} />
          <div className="mt-auto flex flex-col">
            <Button
              aria-label="Help & Information"
              fullWidth
              className="justify-start text-default-500 data-[hover=true]:text-foreground"
              startContent={
                <Icon
                  className="text-default-500"
                  icon="solar:info-circle-line-duotone"
                  width={24}
                />
              }
              variant="light"
              as={Link}
              href="/dashboard"
            >
              Help & Information
            </Button>
            <Button
              aria-label="Log Out"
              className="justify-start text-default-500 data-[hover=true]:text-foreground"
              startContent={
                <Icon
                  className="rotate-180 text-default-500"
                  icon="solar:minus-circle-line-duotone"
                  width={24}
                />
              }
              variant="light"
              onPress={async () => {
                await signOut();
                window.location.href = '/auth/login';
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
        <div className="w-[80vw] flex-1 flex-col p-4">
          <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
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
                    <Link href={item.link}>
                      {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                    </Link>
                  ) : (
                    <span>
                      {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                    </span>
                  )}
                </BreadcrumbItem>
              ))}
            </NextUIBreadcrumbs>
          </header>
          <main className="mt-4 h-full w-full overflow-visible">
            <div className="flex h-[85vh] flex-col gap-4 overflow-scroll rounded-medium border-small border-divider p-4 py-12">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
