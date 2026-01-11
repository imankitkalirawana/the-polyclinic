import { useGenericMutation } from '@/services/useGenericMutation';
import { useGenericQuery } from '@/services/useGenericQuery';

import { Notifications } from './notifications.api';

export const useAllNotifications = (status?: 'unread' | 'read') =>
  useGenericQuery({
    queryKey: ['notifications', status],
    queryFn: () => Notifications.getAll({ status }),
  });

export const useMarkAsRead = () =>
  useGenericMutation({
    mutationFn: ({ notificationIds }: { notificationIds: string[] }) =>
      Notifications.markAsRead(notificationIds),
    invalidateQueries: [['notifications']],
  });
