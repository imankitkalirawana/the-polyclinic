import { DrugType } from '@/services/client/drug/drug.types';
import { apiRequest } from '@/libs/axios';

export class DrugApi {
  private static API_BASE = '/client/drugs';

  static async getAll() {
    return await apiRequest<DrugType[]>({
      url: this.API_BASE,
    });
  }

  static async getByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await apiRequest<DrugType>({
      url: `${this.API_BASE}/${uid}`,
    });
  }

  static async getByDid(did: number) {
    return await apiRequest<DrugType>({
      url: `${this.API_BASE}/${did}`,
    });
  }

  static async update(data: DrugType) {
    return await apiRequest<DrugType>({
      url: `${this.API_BASE}/${data.did}`,
      method: 'PUT',
      data,
    });
  }

  static async delete(did: number) {
    return await apiRequest<DrugType>({
      url: `${this.API_BASE}/${did}`,
      method: 'DELETE',
    });
  }
}
