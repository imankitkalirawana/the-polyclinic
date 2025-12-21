import { apiRequest } from '@/lib/axios';
import { AppointmentQueueType } from './types';
import { PrescriptionFormSchema } from '@/components/client/appointments/queue/priscription-panel';

export class AppointmentQueueApi {
  private static API_BASE = '/client/appointments/queue';

  static async getAll() {
    return await apiRequest<AppointmentQueueType[]>({
      url: this.API_BASE,
    });
  }

  static async getQueueForDoctor(doctorId: string, sequenceNumber?: string) {
    return await apiRequest<{
      previous: AppointmentQueueType[];
      current: AppointmentQueueType | null;
      next: AppointmentQueueType[];
    }>({
      url: `${this.API_BASE}/doctor/${doctorId}/queue`,
      params: { sequenceNumber },
    });
  }

  static async call(queueId: string) {
    return await apiRequest<AppointmentQueueType>({
      url: `${this.API_BASE}/${queueId}/call`,
      method: 'PATCH',
    });
  }

  static async skip(queueId: string) {
    return await apiRequest<AppointmentQueueType>({
      url: `${this.API_BASE}/${queueId}/skip`,
      method: 'PATCH',
    });
  }

  static async clockIn(queueId: string) {
    return await apiRequest<AppointmentQueueType>({
      url: `${this.API_BASE}/${queueId}/clock-in`,
      method: 'PATCH',
    });
  }

  static async complete(queueId: string, data: PrescriptionFormSchema) {
    return await apiRequest<AppointmentQueueType>({
      url: `${this.API_BASE}/${queueId}/complete`,
      method: 'PATCH',
      data: data,
    });
  }
}
