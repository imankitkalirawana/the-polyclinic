import { apiRequest } from '@/lib/axios';
import { GetAllNotificationsResponse } from './api.types';

export class Notifications {
  private static API_BASE = '/common/notifications';

  static async getAll() {
    return await apiRequest<GetAllNotificationsResponse>({
      url: this.API_BASE,
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
