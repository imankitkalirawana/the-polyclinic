'use client';

import React from 'react';
import { Badge, Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { cn } from '@heroui/react';
import {
  Notification,
  NotificationAction,
  NotificationType,
} from '@/services/common/notifications/notifications.types';
import { formatDistanceToNow } from 'date-fns';
import { useMarkAsRead } from '@/services/common/notifications/notifications.query';
import { useNotificationHandler } from '@/services/common/notifications/hooks/useNotificationHandler';
import { Streamdown } from 'streamdown';
interface NotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  notification: Notification;
}

const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ notification, className, ...props }, ref) => {
    const { type, message, title, status, priority, actions, createdAt, nid } = notification;
    const { mutateAsync: markAsRead, isPending } = useMarkAsRead();

    const isRead = status === 'read';

    const handleMarkAsRead = async () => {
      await markAsRead({ notificationIds: [nid] });
    };

    /**
     * Get icon based on notification type
     */
    const getTypeIcon = (type: NotificationType): string => {
      switch (type) {
        case 'appointment':
          return 'solar:calendar-linear';
        case 'billing':
          return 'solar:bill-list-linear';
        case 'system':
          return 'solar:bell-linear';
        default:
          return 'solar:notification-linear';
      }
    };

    /**
     * Get color based on priority
     */
    const getPriorityColor = () => {
      switch (priority) {
        case 'high':
          return 'danger';
        case 'medium':
          return 'warning';
        case 'low':
          return 'default';
        default:
          return 'default';
      }
    };

    /**
     * Format the notification time
     */
    const formatTime = (date: Date) => {
      try {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
      } catch (error) {
        return 'Recently';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-3 border-b border-divider px-6 py-4 transition-colors',
          {
            'bg-default-100': !isRead,
          },
          className
        )}
        {...props}
      >
        <div className="relative flex-none">
          <Badge
            color={getPriorityColor()}
            content=""
            isInvisible={isRead}
            placement="bottom-right"
            shape="circle"
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full bg-default-100',
                {
                  'bg-default-200': !isRead,
                }
              )}
            >
              <Icon className="text-default-500" icon={getTypeIcon(type)} width={20} />
            </div>
          </Badge>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          {title && <h6 className="font-semibold text-foreground text-small">{title}</h6>}
          {/* <p className="text-foreground text-small"> */}
          <Streamdown>{message}</Streamdown>
          {/* </p> */}
          {actions && (
            <div className="flex gap-2 pt-2">
              {actions
                .filter((action) => {
                  // Always show actions with method "get"
                  if (action.method === 'get') {
                    return action.isVisible;
                  }
                  // For other actions, only show when notification is unread
                  return notification.status === 'unread' && action.isVisible;
                })
                .map((action) => (
                  <ActionButton key={action.label} action={action} notification={notification} />
                ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <time className="text-default-400 text-tiny">{formatTime(createdAt)}</time>
            {priority && priority !== 'medium' && (
              <span
                className={cn('capitalize text-tiny', {
                  'text-danger': priority === 'high',
                  'text-default-400': priority === 'low',
                })}
              >
                • {priority} priority
              </span>
            )}
          </div>
        </div>
        {!isRead && (
          <div className="flex items-start pt-1">
            <Tooltip delay={1000} content="Mark as read">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="default"
                onPress={handleMarkAsRead}
                className="h-8 w-8 min-w-8"
                aria-label="Mark as read"
                isLoading={isPending}
              >
                <Icon icon="solar:check-read-linear" width={16} />
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';

const ActionButton = ({
  action,
  notification,
}: {
  action: NotificationAction;
  notification: Notification;
}) => {
  const { handleNotificationAction, isLoading } = useNotificationHandler();
  return (
    <Button
      onPress={() => handleNotificationAction(notification, action)}
      color={action.color}
      size="sm"
      variant="flat"
      isLoading={isLoading}
    >
      {action.label}
    </Button>
  );
};

export default NotificationItem;
