import { AppointmentType, CreateAppointmentType } from './types';
import { apiRequest } from '@/lib/axios';

export class AppointmentApi {
  private static API_BASE = '/client/appointments';

  static async getAll() {
    return await apiRequest<AppointmentType[]>({
      url: this.API_BASE,
    });
  }

  static async getById(aid?: string | null) {
    if (!aid) {
      return {
        success: false,
        data: null,
        message: 'Appointment not found',
      };
    }
    return await apiRequest<AppointmentType>({
      url: `${this.API_BASE}/${aid}`,
    });
  }

  static async create(appointment: CreateAppointmentType) {
    return await apiRequest<AppointmentType>({
      url: this.API_BASE,
      method: 'POST',
      data: appointment,
    });
  }

  static async confirm(aid: string) {
    return await apiRequest<AppointmentType>({
      url: `${this.API_BASE}/${aid}/confirm`,
      method: 'PATCH',
    });
  }

  static async cancel(aid: string, remarks: string) {
    return await apiRequest<AppointmentType>({
      url: `${this.API_BASE}/${aid}/cancel`,
      method: 'PATCH',
      data: { remarks },
    });
  }

  static async changeDoctor(aid: string, doctorUID: string) {
    return await apiRequest<AppointmentType>({
      url: `${this.API_BASE}/${aid}/change-doctor`,
      method: 'PATCH',
      data: { doctorUID },
    });
  }

  static async reschedule(aid: string, date: string) {
    return await apiRequest<AppointmentType>({
      url: `${this.API_BASE}/${aid}/reschedule`,
      method: 'PATCH',
      data: { date },
    });
  }

  static async sendReminder(aid: string, emails: string | string[]) {
    return await apiRequest<{ message: string }>({
      url: `${this.API_BASE}/${aid}/reminder`,
      method: 'POST',
      data: { emails },
    });
  }
}
