import { fetchData } from '@/services/fetch';
import { CreateUser, UnifiedUser, UpdateUser } from './types';

export class User {
  private static API_BASE = '/common/users';

  static async getSelf() {
    return await fetchData<UnifiedUser>('/users/self');
  }

  static async getLinked() {
    return await fetchData<UnifiedUser[]>('/users/linked');
  }

  static async getAll() {
    return await fetchData<UnifiedUser[]>(this.API_BASE);
  }

  static async getByUID(uid?: string | null) {
    if (!uid) {
      return { success: false, message: 'UID is required', data: null };
    }
    return await fetchData<UnifiedUser>(`${this.API_BASE}/${uid}`);
  }

  static async create(data: CreateUser) {
    return await fetchData<UnifiedUser>(this.API_BASE, {
      method: 'POST',
      data,
    });
  }

  static async update(uid: string, data: UpdateUser) {
    return await fetchData<UnifiedUser>(`${this.API_BASE}/${uid}`, {
      method: 'PUT',
      data,
    });
  }

  static async delete(uid: string, organization?: string | null) {
    return await fetchData(`${this.API_BASE}/${uid}`, {
      method: 'DELETE',
      data: { organization },
    });
  }
}
