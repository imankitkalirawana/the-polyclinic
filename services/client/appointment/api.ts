import { fetchData } from '@/services/fetch';
import { AppointmentType, CreateAppointmentType } from './types';

export class AppointmentApi {
  private static API_BASE = '/client/appointments';

  static async getAll() {
    return await fetchData<AppointmentType[]>(this.API_BASE);
  }

  static async getById(aid: string) {
    return await fetchData<AppointmentType>(`${this.API_BASE}/${aid}`);
  }

  static async create(appointment: CreateAppointmentType) {
    return await fetchData<AppointmentType>(this.API_BASE, {
      method: 'POST',
      data: appointment,
    });
  }
}
