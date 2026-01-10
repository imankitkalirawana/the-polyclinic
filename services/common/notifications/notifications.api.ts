export class Notifications {
  private static API_BASE = '/common/notifications';

  static async getAll(_params?: { status?: 'unread' | 'read' }) {
    // return dummy data
    return Promise.resolve({
      success: true,
      data: [],
      message: 'Notifications fetched successfully',
    });
  }

  static async markAsRead(_notificationIds: string[]) {
    return Promise.resolve({
      success: true,
      data: null,
      message: 'Notifications marked as read',
    });
  }
}
