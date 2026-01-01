import { apiRequest } from '@/lib/axios';
import { AppointmentQueueResponse, VerifyPaymentRequest } from './types';
import { PrescriptionFormSchema } from '@/components/client/appointments/queue/priscription-panel';
import { AppointmentQueueRequest } from './types';

export class AppointmentQueueApi {
  private static API_BASE = '/client/appointments/queue';

  static async getAll() {
    return await apiRequest<AppointmentQueueResponse[]>({
      url: this.API_BASE,
    });
  }

  static async getById(queueId: string | null) {
    if (!queueId) {
      throw new Error('Queue ID is required');
    }
    return await apiRequest<AppointmentQueueResponse>({
      url: `${this.API_BASE}/${queueId}`,
    });
  }

  // create appointment queue
  static async create(data: AppointmentQueueRequest) {
    return await apiRequest<
      AppointmentQueueResponse & { orderId: string; amount: number; currency: string }
    >({
      url: `${this.API_BASE}`,
      method: 'POST',
      data,
    });
  }

  // verify payment
  static async verifyPayment(data: VerifyPaymentRequest) {
    return await apiRequest<{ success: boolean; message: string }>({
      url: `${this.API_BASE}/verify-payment`,
      method: 'POST',
      data,
    });
  }

  static async getQueueForDoctor(doctorId: string, queueId?: string | null) {
    return await apiRequest<{
      previous: AppointmentQueueResponse[];
      current: AppointmentQueueResponse | null;
      next: AppointmentQueueResponse[];
    }>({
      url: `${this.API_BASE}/doctor/${doctorId}/queue`,
      params: { id: queueId },
    });
  }

  static async call(queueId: string) {
    return await apiRequest<AppointmentQueueResponse>({
      url: `${this.API_BASE}/${queueId}/call`,
      method: 'PATCH',
    });
  }

  static async skip(queueId: string) {
    return await apiRequest<AppointmentQueueResponse>({
      url: `${this.API_BASE}/${queueId}/skip`,
      method: 'PATCH',
    });
  }

  static async clockIn(queueId: string) {
    return await apiRequest<AppointmentQueueResponse>({
      url: `${this.API_BASE}/${queueId}/clock-in`,
      method: 'PATCH',
    });
  }

  static async complete(queueId: string, data: PrescriptionFormSchema) {
    return await apiRequest<AppointmentQueueResponse>({
      url: `${this.API_BASE}/${queueId}/complete`,
      method: 'PATCH',
      data: data,
    });
  }
}
