'use client';

import { Tab, Tabs } from '@heroui/react';
import { useQueryState } from 'nuqs';
import { Icon } from '@iconify/react/dist/iconify.js';

import AccountDetails from './account-details';
import NotificationsSettings from './notifications-settings';
import SecuritySettings from './security-settings';

import { useUserWithUID } from '@/hooks/queries/client/user';

export default function EditUser({ uid }: { uid: string }) {
  const [tab, setTab] = useQueryState('tab', {
    defaultValue: 'account',
  });

  const { data: user, isError, refetch } = useUserWithUID(uid);

  if (isError) {
    return <p>Error fetching user data</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  const tabs = [
    {
      key: 'account',
      title: (
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:user-id-bold" width={20} />
          <p>Account</p>
        </div>
      ),
      content: <AccountDetails user={user} />,
    },
    {
      key: 'notifications-settings',
      title: (
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:bell-bold" width={20} />
          <p>Notifications</p>
        </div>
      ),
      content: <NotificationsSettings />,
    },
    {
      key: 'security-settings',
      title: (
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:shield-keyhole-bold" width={20} />
          <p>Security</p>
        </div>
      ),
      content: <SecuritySettings user={user} refetch={refetch} />,
    },
  ];
  return (
    <Tabs
      classNames={{
        tabList: 'mx-4 text-medium',
        tabContent: 'text-small',
        tab: 'w-fit',
      }}
      color="primary"
      items={tabs}
      aria-label="Options"
      selectedKey={tab}
      onSelectionChange={(key) => setTab(String(key))}
    >
      {(tab) => (
        <Tab key={tab.key} title={tab.title} className="no-scrollbar overflow-y-scroll">
          {tab.content}
        </Tab>
      )}
    </Tabs>
  );
}
