import { fetchData } from '@/services/fetch';
import { PatientType } from './types';

export class Patient {
  private static API_BASE = '/client/patients';

  static async getAll() {
    return await fetchData<PatientType[]>(this.API_BASE);
  }

  static async getByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await fetchData<PatientType>(`${this.API_BASE}/${uid}`);
  }
}
