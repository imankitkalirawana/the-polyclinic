import { fetchData } from '@/services/fetch';
import { DoctorType, SlotConfig } from './types';

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

export class DoctorSlots {
  private static API_BASE = '/client/doctors';

  static async getSlotsByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await fetchData<SlotConfig>(`${this.API_BASE}/${uid}/slots`);
  }

  static async updateSlotsByUID(uid: string, slot: SlotConfig) {
    return await fetchData<SlotConfig>(`${this.API_BASE}/${uid}/slots`, {
      method: 'POST',
      data: slot,
    });
  }
}
