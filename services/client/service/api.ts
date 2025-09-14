import { fetchData } from '@/services/fetch';
import { ServiceType } from '@/services/client/service/types';

export class ServiceApi {
  private static API_BASE = '/client/services';

  static async getAll() {
    return await fetchData<ServiceType[]>(this.API_BASE);
  }

  static async getByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await fetchData<ServiceType>(`${this.API_BASE}/${uid}`);
  }

  static async create(service: ServiceType) {
    return await fetchData<ServiceType>(this.API_BASE, {
      method: 'POST',
      data: service,
    });
  }

  static async update(uid: string, service: ServiceType) {
    return await fetchData<ServiceType>(`${this.API_BASE}/${uid}`, {
      method: 'PUT',
      data: service,
    });
  }

  static async delete(uid: string) {
    return await fetchData<ServiceType>(`${this.API_BASE}/${uid}`, {
      method: 'DELETE',
    });
  }
}
