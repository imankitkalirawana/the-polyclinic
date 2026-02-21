import { apiRequest } from '@/libs/axios';
import { Department } from '@/shared';
import { $FixMe } from '@/types';

export class DepartmentApi {
  private static API_BASE = '/client/departments';

  static async getAll() {
    return await apiRequest<Department[]>({
      url: this.API_BASE,
    });
  }

  static async getByDid(did?: string | null) {
    if (!did) {
      return { success: false, message: 'Department Id is required', data: null };
    }
    return await apiRequest<Department>({
      url: `${this.API_BASE}/${did}`,
    });
  }

  static async create(data: $FixMe) {
    return await apiRequest<Department>({
      url: this.API_BASE,
      method: 'POST',
      data,
    });
  }

  static async update(did: string, data: $FixMe) {
    return await apiRequest<Department>({
      url: `${this.API_BASE}/${did}`,
      method: 'PUT',
      data,
    });
  }

  static async delete(did: string) {
    return await apiRequest<{ success: boolean; message: string }>({
      url: `${this.API_BASE}/${did}`,
      method: 'DELETE',
    });
  }
}
