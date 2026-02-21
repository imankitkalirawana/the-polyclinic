import { Drug } from '@/shared';
import { apiRequest } from '@/libs/axios';

export class DrugApi {
  private static API_BASE = '/drugs';

  static async getAll() {
    return await apiRequest<Drug[]>({
      url: this.API_BASE,
    });
  }

  static async getByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await apiRequest<Drug>({
      url: `${this.API_BASE}/${uid}`,
    });
  }

  static async getByDid(did: number) {
    return await apiRequest<Drug>({
      url: `${this.API_BASE}/${did}`,
    });
  }

  static async update(data: Drug) {
    return await apiRequest<Drug>({
      url: `${this.API_BASE}/${data.unique_id}`,
      method: 'PUT',
      data,
    });
  }

  static async delete(unique_id: number) {
    return await apiRequest<Drug>({
      url: `${this.API_BASE}/${unique_id}`,
      method: 'DELETE',
    });
  }
}
