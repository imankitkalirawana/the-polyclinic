import { Notification } from './types';

export type GetAllNotificationsResponse = {
  notifications: Notification[];
  stats: {
    total: number;
    unread: number;
    read: number;
  };
};
