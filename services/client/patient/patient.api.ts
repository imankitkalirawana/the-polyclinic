import { PatientType } from './patient.types';
import { AppointmentType } from '../appointment';
import { apiRequest } from '@/libs/axios';

export class PatientApi {
  private static API_BASE = '/patients';

  static async getAll(search?: string) {
    return await apiRequest<PatientType[]>({
      url: this.API_BASE,
      params: {
        search,
      },
    });
  }

  static async getById(id?: string | null) {
    if (!id) {
      return { success: false, message: 'ID is required', data: null };
    }
    return await apiRequest<PatientType>({
      url: `${this.API_BASE}/${id}`,
    });
  }

  static async getPreviousAppointments(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }

    return await apiRequest<AppointmentType[]>({
      url: `${this.API_BASE}/${uid}/appointments`,
    });
  }
}
