import { $FixMe } from '@/types';
import { fetchData } from '../../api';

const API_BASE = '/client/appointments';

export const getAllAppointments = async () => await fetchData<$FixMe[]>(API_BASE);

export const getAppointmentWithAID = async (aid: string) =>
  await fetchData<$FixMe>(`${API_BASE}/${aid}`);

export const createAppointment = async (appointment: $FixMe) =>
  await fetchData<$FixMe>('/appointments', {
    method: 'POST',
    data: appointment,
  });

export class AppointmentApi {
  private static API_BASE = '/client/appointments';

  static async getAll() {
    return await fetchData<$FixMe[]>(this.API_BASE);
  }

  static async getById(aid: string) {
    return await fetchData<$FixMe>(`${this.API_BASE}/${aid}`);
  }

  static async create(appointment: $FixMe) {
    return await fetchData<$FixMe>(this.API_BASE, {
      method: 'POST',
      data: appointment,
    });
  }
}
