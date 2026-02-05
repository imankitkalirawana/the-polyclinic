import { apiRequest } from '@/libs/axios';
import {
  AppointmentQueueFilters,
  AppointmentQueueFiltersPayload,
  AppointmentQueueMetaData,
  AppointmentQueueType,
  PaymentDetails,
  VerifyPaymentRequest,
} from './queue.types';
import { PrescriptionFormSchema } from '@/components/dashboard/appointments/queue/views/doctor/prescription-panel';
import { AppointmentQueueRequest } from './queue.types';
import { ActivityLogResponse } from '@/services/common/activity/activity.types';
import { format } from 'date-fns/format';
import { CalendarDate } from '@internationalized/date';

function toFiltersPayload(
  filters: AppointmentQueueFilters | undefined
): AppointmentQueueFiltersPayload | undefined {
  if (!filters) return undefined;
  const start = filters.date?.start;
  const end = filters.date?.end;
  return {
    date: {
      start: start
        ? typeof start === 'object' && 'toString' in start
          ? (start as CalendarDate).toString()
          : String(start)
        : null,
      end: end
        ? typeof end === 'object' && 'toString' in end
          ? (end as CalendarDate).toString()
          : String(end)
        : null,
    },
    ...(filters.status?.length ? { status: filters.status } : {}),
    ...(filters.doctorId != null && filters.doctorId !== '' ? { doctorId: filters.doctorId } : {}),
  };
}

export class AppointmentQueueApi {
  private static API_BASE = '/client/appointments/queue';

  static async getAll(filters?: AppointmentQueueFilters) {
    return await apiRequest<{
      queues: AppointmentQueueType[];
      filters: AppointmentQueueFilters;
      metaData: AppointmentQueueMetaData;
    }>({
      method: 'POST',
      url: `${this.API_BASE}/all`,
      data: toFiltersPayload(filters),
    });
  }

  static async getById(queueId?: string | null) {
    if (!queueId) {
      throw new Error('Queue ID is required');
    }
    return await apiRequest<AppointmentQueueType>({
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
    return await apiRequest<AppointmentQueueType & PaymentDetails>({
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
      previous: AppointmentQueueType[];
      current: AppointmentQueueType | null;
      next: AppointmentQueueType[];
    }>({
      url: `${this.API_BASE}/doctor/${doctorId}/queue`,
      params: { id: queueId, date: sanitizedAppointmentDate },
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

  static async downloadReceipt(appointmentId: string) {
    return await apiRequest<Blob>({
      url: `${this.API_BASE}/receipt/${appointmentId}`,
      method: 'GET',
      responseType: 'blob',
    });
  }
}
