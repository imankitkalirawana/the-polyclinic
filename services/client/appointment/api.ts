import { AppointmentType, CreateAppointmentType } from './types';
import { apiRequest } from '@/lib/axios';

export class AppointmentApi {
  private static API_BASE = '/client/appointments';

  static async getAll() {
    return await apiRequest<AppointmentType[]>({
      url: this.API_BASE,
    });
  }

  static async getById(aid: string) {
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
}
