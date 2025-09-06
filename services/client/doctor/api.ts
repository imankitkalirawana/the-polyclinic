import { fetchData } from '@/services/fetch';
import { DoctorType } from './types';

export class Doctor {
  private static API_BASE = '/client/doctors';
  static async getAll() {
    return await fetchData<DoctorType[]>(this.API_BASE);
  }

  static async getByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await fetchData<DoctorType>(`${this.API_BASE}/${uid}`);
  }
}
