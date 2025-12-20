import { apiRequest } from '@/lib/axios';
import { AppointmentQueueType } from './types';

export class AppointmentQueueApi {
  private static API_BASE = '/client/appointments/queue';

  static async getAll() {
    return await apiRequest<AppointmentQueueType[]>({
      url: this.API_BASE,
    });
  }
}
