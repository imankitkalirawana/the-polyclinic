import { DoctorType, SlotConfig } from './types';
import { apiRequest } from '@/lib/axios';

export class Doctor {
  private static API_BASE = '/client/doctors';
  static async getAll() {
    return await apiRequest<DoctorType[]>({
      url: this.API_BASE,
    });
  }

  static async getByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await apiRequest<DoctorType>({
      url: `${this.API_BASE}/${uid}`,
    });
  }
}

export class DoctorSlots {
  private static API_BASE = '/client/doctors';

  static async getSlotsByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await apiRequest<SlotConfig>({
      url: `${this.API_BASE}/${uid}/slots`,
    });
  }

  static async updateSlotsByUID(uid: string, slot: SlotConfig) {
    return await apiRequest<SlotConfig>({
      url: `${this.API_BASE}/${uid}/slots`,
      method: 'POST',
      data: slot,
    });
  }
}
