import { apiRequest } from '@/lib/axios';
import { CreateUserRequest, UserType, UpdateUserRequest } from './user.types';

export class UserApi {
  private static API_BASE = '/client/users';

  static async getSelf() {
    return await apiRequest<UserType>({
      url: `${this.API_BASE}/self`,
    });
  }

  static async getLinked() {
    return await apiRequest<UserType[]>({
      url: `${this.API_BASE}/linked`,
    });
  }

  static async getAll() {
    return await apiRequest<UserType[]>({
      url: this.API_BASE,
    });
  }

  static async getByID(id?: string | null) {
    if (!id) {
      return { success: false, message: 'User ID is required', data: null };
    }
    return await apiRequest<UserType>({
      url: `${this.API_BASE}/${id}`,
    });
  }

  static async create(data: CreateUserRequest) {
    return await apiRequest<UserType>({
      url: this.API_BASE,
      method: 'POST',
      data,
    });
  }

  static async update(id: string, data: UpdateUserRequest) {
    return await apiRequest<UserType>({
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
