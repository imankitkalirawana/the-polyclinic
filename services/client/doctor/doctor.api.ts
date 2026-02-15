import { DoctorSpecialization, DoctorType, SlotConfig } from './doctor.types';
import { apiRequest } from '@/libs/axios';
import { CreateSpecializationDto } from './doctor.dto';

export class Doctor {
  private static API_BASE = '/doctors';
  static async getAll(search?: string) {
    return await apiRequest<{
      doctors: DoctorType[];
      categories: DoctorSpecialization[];
    }>({
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
    return await apiRequest<DoctorType>({
      url: `${this.API_BASE}/${id}`,
    });
  }

  static async getSpecializations() {
    return await apiRequest<DoctorSpecialization[]>({
      url: `${this.API_BASE}/specializations`,
    });
  }

  static async createSpecialization(specialization: CreateSpecializationDto) {
    return await apiRequest<DoctorSpecialization>({
      url: `${this.API_BASE}/specializations`,
      method: 'POST',
      data: specialization,
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
