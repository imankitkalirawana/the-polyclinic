import { DepartmentType } from './types';
import { apiRequest } from '@/lib/axios';

export class Department {
  private static API_BASE = '/client/departments';

  static async getAll() {
    return await apiRequest<DepartmentType[]>({
      url: this.API_BASE,
    });
  }

  static async getBySlug(slug?: string | null) {
    if (!slug) {
      return { success: false, message: 'Slug is required', data: null };
    }
    return await apiRequest<DepartmentType>({
      url: `${this.API_BASE}/${slug}`,
    });
  }

  static async create(data: Partial<DepartmentType>) {
    return await apiRequest<DepartmentType>({
      url: this.API_BASE,
      method: 'POST',
      data,
    });
  }

  static async update(slug: string, data: Partial<DepartmentType>) {
    return await apiRequest<DepartmentType>({
      url: `${this.API_BASE}/${slug}`,
      method: 'PUT',
      data,
    });
  }

  static async delete(slug: string) {
    return await apiRequest<{ success: boolean; message: string }>({
      url: `${this.API_BASE}/${slug}`,
      method: 'DELETE',
    });
  }
}
