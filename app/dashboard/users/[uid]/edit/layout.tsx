'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  params: {
    uid: number;
  };
}

export default function Layout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { uid: number };
}>) {
  const pathname = usePathname();
  // get the last part of the pathname
  const lastPath =
    pathname.split('/').pop() === 'edit' ? '' : pathname.split('/').pop();

  const tabs = [
    {
      key: '',
      title: (
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:user-id-bold" width={20} />
          <p>Account</p>
        </div>
      )
    },
    {
      key: 'notifications-settings',
      title: (
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:bell-bold" width={20} />
          <p>Notifications</p>
        </div>
      )
    },
    {
      key: 'security-settings',
      title: (
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:shield-keyhole-bold" width={20} />
          <p>Security</p>
        </div>
      )
    }
  ];
  return (
    <>
      <Tabs
        classNames={{
          tabList: 'mx-4 text-medium',
          tabContent: 'text-small',
          tab: 'w-fit'
        }}
        color="primary"
        items={tabs}
        aria-label="Options"
        selectedKey={lastPath}
      >
        {(tab) => (
          <Tab
            key={tab.key}
            as={Link}
            href={`/dashboard/users/${params.uid}/edit/${tab.key}`}
            title={tab.title}
            className="no-scrollbar overflow-y-scroll"
          >
            {children}
          </Tab>
        )}
      </Tabs>
    </>
  );
}
