import { useState } from 'react';
import { apiRequest } from '@/libs/axios';
import { Notification, NotificationAction } from '../notifications.types';
import { useMarkAsRead } from '../notifications.query';

export function useNotificationHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: markAsRead } = useMarkAsRead();

  const handleNotificationAction = async (
    notification: Notification,
    action: NotificationAction
  ) => {
    setIsLoading(true);
    try {
      if (action.method?.toLowerCase() === 'get') {
        window.open(action.url, '_blank');
      } else {
        await apiRequest({
          url: action.url,
          method: action.method,
          data: action.body || {},
        });
      }
    } catch (error) {
      console.error('Notification action failed:', error);
    } finally {
      setIsLoading(false);
      markAsRead({ notificationIds: [notification.nid] });
    }
  };

  return { handleNotificationAction, isLoading };
}
