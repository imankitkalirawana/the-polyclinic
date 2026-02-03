import { CreateDepartmentType, DepartmentType, UpdateDepartmentType } from './department.types';
import { apiRequest } from '@/libs/axios';

export class DepartmentApi {
  private static API_BASE = '/client/departments';

  static async getAll() {
    return await apiRequest<DepartmentType[]>({
      url: this.API_BASE,
    });
  }

  static async getByDid(did?: string | null) {
    if (!did) {
      return { success: false, message: 'Department Id is required', data: null };
    }
    return await apiRequest<DepartmentType>({
      url: `${this.API_BASE}/${did}`,
    });
  }

  static async create(data: CreateDepartmentType) {
    return await apiRequest<DepartmentType>({
      url: this.API_BASE,
      method: 'POST',
      data,
    });
  }

  static async update(did: string, data: UpdateDepartmentType) {
    return await apiRequest<DepartmentType>({
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
