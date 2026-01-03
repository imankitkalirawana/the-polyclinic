import { apiRequest } from '@/lib/axios';
import { GetAllNotificationsResponse } from './notifications.types';

export class Notifications {
  private static API_BASE = '/common/notifications';

  static async getAll(params?: { status?: 'unread' | 'read' }) {
    return await apiRequest<GetAllNotificationsResponse>({
      url: this.API_BASE,
      params,
    });
  }

  static async markAsRead(notificationIds: string[]) {
    return await apiRequest({
      url: `${this.API_BASE}/mark-as-read`,
      method: 'POST',
      data: { notificationIds },
    });
  }
}
