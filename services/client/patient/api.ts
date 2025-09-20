import { PatientType } from './types';
import { AppointmentType } from '../appointment';
import { apiRequest } from '@/lib/axios';

export class Patient {
  private static API_BASE = '/client/patients';

  static async getAll() {
    return await apiRequest<PatientType[]>({
      url: this.API_BASE,
    });
  }

  static async getByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await apiRequest<PatientType>({
      url: `${this.API_BASE}/${uid}`,
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
