import { apiRequest } from '@/libs/axios';
import { AppointmentQueueResponse, PaymentDetails, VerifyPaymentRequest } from './queue.types';
import { PrescriptionFormSchema } from '@/components/dashboard/appointments/queue/views/doctor/prescription-panel';
import { AppointmentQueueRequest } from './queue.types';
import { ActivityLogResponse } from '@/services/common/activity/activity.types';
import { format } from 'date-fns/format';

export class AppointmentQueueApi {
  private static API_BASE = '/client/appointments/queue';

  static async getAll() {
    return await apiRequest<AppointmentQueueResponse[]>({
      url: this.API_BASE,
    });
  }

  static async getById(queueId?: string | null) {
    if (!queueId) {
      throw new Error('Queue ID is required');
    }
    return await apiRequest<AppointmentQueueResponse>({
      url: `${this.API_BASE}/${queueId}`,
    });
  }

  static async getActivityLogs(queueId?: string | null) {
    if (!queueId) {
      throw new Error('Queue ID is required');
    }
    return await apiRequest<ActivityLogResponse[]>({
      url: `${this.API_BASE}/${queueId}/activity-logs`,
    });
  }

  // create appointment queue
  static async create(data: AppointmentQueueRequest) {
    return await apiRequest<AppointmentQueueResponse & PaymentDetails>({
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

  static async getQueueForDoctor(
    doctorId?: string | null,
    queueId?: string | null,
    appointmentDate?: Date | null
  ) {
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }

    // sanitize appointment date
    const sanitizedAppointmentDate = appointmentDate
      ? format(appointmentDate, 'yyyy-MM-dd')
      : undefined;

    return await apiRequest<{
      previous: AppointmentQueueResponse[];
      current: AppointmentQueueResponse | null;
      next: AppointmentQueueResponse[];
    }>({
      url: `${this.API_BASE}/doctor/${doctorId}/queue`,
      params: { id: queueId, date: sanitizedAppointmentDate },
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

  static async downloadReceipt(appointmentId: string) {
    return await apiRequest<Blob>({
      url: `${this.API_BASE}/receipt/${appointmentId}`,
      method: 'GET',
      responseType: 'blob',
    });
  }
}
