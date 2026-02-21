import { AppointmentQueue, Patient } from '@/shared';
import { apiRequest } from '@/libs/axios';

export class PatientApi {
  private static API_BASE = '/patients';

  static async getAll(search?: string) {
    return await apiRequest<Patient[]>({
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
    return await apiRequest<Patient>({
      url: `${this.API_BASE}/${id}`,
    });
  }

  static async getPreviousAppointments(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }

    return await apiRequest<AppointmentQueue[]>({
      url: `${this.API_BASE}/${uid}/appointments`,
    });
  }
}
