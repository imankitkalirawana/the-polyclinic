import { apiRequest } from '@/lib/axios';
import { CreateUser, UnifiedUser, UpdateUser } from './user.types';

export class User {
  private static API_BASE = '/client/users';

  static async getSelf() {
    return await apiRequest<UnifiedUser>({
      url: `${this.API_BASE}/self`,
    });
  }

  static async getLinked() {
    return await apiRequest<UnifiedUser[]>({
      url: `${this.API_BASE}/linked`,
    });
  }

  static async getAll() {
    return await apiRequest<UnifiedUser[]>({
      url: this.API_BASE,
    });
  }

  static async getByID(id?: string | null) {
    if (!id) {
      return { success: false, message: 'User ID is required', data: null };
    }
    return await apiRequest<UnifiedUser>({
      url: `${this.API_BASE}/${id}`,
    });
  }

  static async create(data: CreateUser) {
    return await apiRequest<UnifiedUser>({
      url: this.API_BASE,
      method: 'POST',
      data,
    });
  }

  static async update(id: string, data: UpdateUser) {
    return await apiRequest<UnifiedUser>({
      url: `${this.API_BASE}/${id}`,
      method: 'PUT',
      data,
    });
  }

  static async delete(id: string) {
    return await apiRequest({
      url: `${this.API_BASE}/${id}/delete`,
      method: 'DELETE',
    });
  }
}
