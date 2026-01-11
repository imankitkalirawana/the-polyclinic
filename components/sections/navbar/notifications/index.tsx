'use client';

import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tabs,
  Tab,
  ScrollShadow,
  CardFooter,
  Popover,
  PopoverTrigger,
  Badge,
  PopoverContent,
  ButtonProps,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import NotificationItem from './notification-item';
import { Notification } from '@/services/common/notifications/notifications.types';
import {
  useAllNotifications,
  useMarkAsRead,
} from '@/services/common/notifications/notifications.query';
import { GetAllNotificationsResponse } from '@/services/common/notifications/notifications.types';
import MinimalPlaceholder from '@/components/ui/minimal-placeholder';

enum NotificationTabs {
  all = 'all',
  unread = 'unread',
}

export function Notifications({
  isLoading,
  notifications,
  stats,
  activeTab,
  setActiveTab,
}: {
  isLoading: boolean;
  notifications: Notification[];
  stats: GetAllNotificationsResponse['stats'];
  activeTab: NotificationTabs;
  setActiveTab: (tab: NotificationTabs) => void;
}) {
  const { mutateAsync: markAsRead, isPending: isMarkingAsRead } = useMarkAsRead();

  // Filter notifications based on active tab
  const filteredNotifications = React.useMemo(() => {
    if (activeTab === NotificationTabs.unread) {
      return notifications.filter((notification) => notification.status === 'unread');
    }
    return notifications;
  }, [notifications, activeTab]);

  const handleMarkAllAsRead = () => {
    markAsRead({ notificationIds: notifications.map((notification) => notification.nid) });
  };

  return (
    <Card className="w-full min-w-[512px]">
      <CardHeader className="flex flex-col px-0 pb-0">
        <div className="flex w-full items-center justify-between px-5 py-2">
          <div className="inline-flex items-center gap-1">
            <h4 className="inline-block align-middle font-medium text-large">Notifications</h4>
          </div>
          <Button
            className="h-8 px-3"
            color="primary"
            radius="full"
            variant="light"
            onPress={handleMarkAllAsRead}
            isDisabled={stats.unread === 0}
            isLoading={isMarkingAsRead}
          >
            Mark all as read
          </Button>
        </div>
        <Tabs
          aria-label="Notifications"
          classNames={{
            base: 'w-full min-w-[512px]',
            tabList: 'gap-6 px-6 py-0 w-full relative rounded-none border-b border-divider',
            cursor: 'w-full',
            tab: 'px-2 h-12 max-w-fit',
          }}
          color="primary"
          selectedKey={activeTab}
          variant="underlined"
          onSelectionChange={(selected) => setActiveTab(selected as NotificationTabs)}
        >
          <Tab
            key="unread"
            title={
              <div className="flex items-center space-x-2">
                <span>Unread</span>
                <Chip size="sm" variant="flat">
                  {stats.unread}
                </Chip>
              </div>
            }
          />
          <Tab
            key="all"
            title={
              <div className="flex items-center space-x-2">
                <span>All</span>
                <Chip size="sm" variant="flat">
                  {stats.total}
                </Chip>
              </div>
            }
          />
        </Tabs>
      </CardHeader>
      <CardBody className="w-full gap-0 p-0">
        <ScrollShadow className="h-[500px] w-full">
          {isLoading ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <MinimalPlaceholder />
            </div>
          ) : !!filteredNotifications && filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem key={notification.nid} notification={notification} />
            ))
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <Icon className="text-default-400" icon="solar:bell-off-linear" width={40} />
              <p className="text-default-400 text-small">
                {activeTab === NotificationTabs.unread
                  ? 'No unread notifications.'
                  : 'No notifications yet.'}
              </p>
            </div>
          )}
        </ScrollShadow>
      </CardBody>
      <CardFooter className="justify-end gap-2 px-4">
        <Button variant="flat">Settings</Button>
      </CardFooter>
    </Card>
  );
}

export default function NotificationsWrapper({ size = 'md' }: { size?: ButtonProps['size'] }) {
  const [activeTab, setActiveTab] = React.useState<NotificationTabs>(NotificationTabs.unread);

  const { isLoading } = useAllNotifications(
    activeTab === NotificationTabs.unread ? 'unread' : undefined
  );
  const notifications: Notification[] = [];
  const stats = { total: 0, unread: 0, read: 0 };

  return (
    <Popover placement="bottom-end" shouldCloseOnScroll={false}>
      <PopoverTrigger>
        <Button isIconOnly size={size} className="bg-default-200">
          <Badge
            color="danger"
            content={stats.unread}
            showOutline={false}
            size={size}
            isInvisible={stats.unread === 0}
          >
            <Icon icon="solar:bell-linear" width={size === 'sm' ? 18 : 20} />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[420px]">
        <Notifications
          isLoading={isLoading}
          notifications={notifications}
          stats={stats}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </PopoverContent>
    </Popover>
  );
}
