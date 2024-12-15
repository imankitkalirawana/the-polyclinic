'use client';

import React, { useEffect, useState } from 'react';
import { Card, Tabs, Tab } from '@nextui-org/react';
import { Icon } from '@iconify/react';

import AccountDetails from './account-details';
import NotificationsSettings from './notifications-settings';
import SecuritySettings from './security-settings';
import { useSearchParams } from 'next/navigation';
import { CountryProps } from '@/lib/interface';
import Link from 'next/link';
import { UserType } from '@/models/User';

interface EditUserProps {
  user: UserType;
  countries: CountryProps[];
}

export default function EditUser({ user, countries }: EditUserProps) {
  const [currentTab, setCurrentTab] = useState('account-settings');
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    }
  }, [tab]);

  const tabs = [
    {
      key: 'account-settings',
      title: (
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:user-id-bold" width={20} />
          <p>Account</p>
        </div>
      ),
      content: <AccountDetails user={user} countries={countries} />
    },
    {
      key: 'notifications-settings',
      title: (
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:bell-bold" width={20} />
          <p>Notifications</p>
        </div>
      ),
      content: <NotificationsSettings className="p-2 shadow-none" />
    },
    {
      key: 'security-settings',
      title: (
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:shield-keyhole-bold" width={20} />
          <p>Security</p>
        </div>
      ),
      content: <SecuritySettings user={user} />
    }
  ];
  return (
    <Tabs
      classNames={{
        tabList: 'mx-4 text-medium',
        tabContent: 'text-small'
      }}
      radius="full"
      aria-label="Setting Tabs"
      size="lg"
      items={tabs}
      selectedKey={currentTab}
      color="primary"
    >
      {(item) => (
        <Tab
          key={item.key}
          title={item.title}
          href={`/dashboard/users/${user?.uid}/edit?tab=${item.key}`}
          as={Link}
        >
          {item.content}
        </Tab>
      )}
    </Tabs>
  );
}
