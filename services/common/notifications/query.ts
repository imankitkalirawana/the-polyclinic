import { useGenericMutation } from '@/services/useGenericMutation';
import { useQuery } from '@tanstack/react-query';

import { Notifications } from './api';

export const useAllNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await Notifications.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useMarkAsRead = () => {
  return useGenericMutation({
    mutationFn: async ({ notificationIds }: { notificationIds: string[] }) => {
      const res = await Notifications.markAsRead(notificationIds);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    showToast: false,
    successMessage: 'Notifications marked as read',
    errorMessage: 'Error marking notifications as read',
    invalidateQueries: [['notifications']],
  });
};
