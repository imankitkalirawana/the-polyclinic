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
import React, { useEffect, useMemo, useState } from 'react';
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

  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const isHidden = localStorage.getItem('isHidden');
    setIsHidden(isHidden === 'true');
  }, []);

  const pathname = usePathname();
  let currentPath = pathname.split('/')?.[2];

  const pathSegments = pathname?.split('/').filter((segment) => segment !== '');

  const breadcrumbItems = pathSegments?.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return { label: segment, link: path };
  });

  const sidebar = useMemo(() => {
    return (
      <div
        className={cn(
          'relative flex h-full w-72 max-w-[288px] flex-1 flex-col !border-r-small border-divider transition-[transform,opacity,margin] duration-250 ease-in-out',
          {
            '-ml-72 -translate-x-72': isHidden
          }
        )}
      >
        <div
          style={{
            background: "url('/assets/sidebar-profile.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'start'
          }}
          className="relative aspect-square w-full text-white"
        >
          <div className="absolute h-full w-full bg-black/50 backdrop-blur-sm"></div>
          <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center gap-8 p-4">
            <div className="flex w-full items-center justify-between">
              <h2>My Profile</h2>
              <Button
                radius="full"
                className="bg-white/40 text-white backdrop-blur-sm"
                isIconOnly
              >
                <Icon icon="mingcute:edit-line" width={20} />
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar
                className="h-20 w-20"
                size="lg"
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                name={session?.user?.name || 'Anonymous'}
              />
              <p className="text-lg font-medium">{session?.user?.name}</p>
              <p className="text-sm font-light capitalize">
                {session?.user?.role}
              </p>
            </div>
          </div>
        </div>
        <ScrollShadow className="h-full max-h-full pr-6">
          <Sidebar
            defaultSelectedKey="home"
            items={sectionItemsWithTeams}
            selectedKeys={[currentPath || 'dashboard']}
          />
        </ScrollShadow>
        <Spacer y={8} />
        <div className="mt-auto hidden flex-col">
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
    );
  }, [isHidden, session, currentPath]);

  const header = useMemo(() => {
    return (
      <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
        <Button
          aria-label="Toggle Sidebar"
          isIconOnly
          size="sm"
          variant="light"
          onPress={() =>
            setIsHidden((prev) => {
              localStorage.setItem('isHidden', !prev ? 'true' : 'false');
              return !prev;
            })
          }
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
    );
  }, [breadcrumbItems, isHidden]);

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {sidebar}
      <div className="w-[80vw] flex-1 flex-col md:p-4">
        {header}
        <main className="mt-4 h-full w-full overflow-visible">
          <div className="flex h-[85vh] flex-col gap-4 overflow-scroll rounded-medium border-small border-divider p-2 pb-12 pt-4 md:p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
