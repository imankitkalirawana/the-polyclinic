import { $FixMe } from '@/types';
import { apiRequest } from '@/lib/axios';
import { UserType, ResetPasswordRequest, UserProfileType } from './user.types';

export class UserApi {
  private static API_BASE = '/users';

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

  static async getUserProfile(id?: string | null) {
    if (!id) {
      return { success: false, message: 'User ID is required', data: null };
    }
    return await apiRequest<UserProfileType>({
      url: `${this.API_BASE}/${id}/profile`,
    });
  }

  static async resetPassword(id: string, data: ResetPasswordRequest) {
    return await apiRequest({
      url: `${this.API_BASE}/${id}/reset-password`,
      method: 'POST',
      data,
    });
  }

  static async create(data: $FixMe) {
    return await apiRequest<UserType & { linked_id: string }>({
      url: this.API_BASE,
      method: 'POST',
      data,
    });
  }

  static async update(id: string, data: UserProfileType) {
    return await apiRequest<UserType>({
      url: `${this.API_BASE}/${id}/profile`,
      method: 'PATCH',
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
