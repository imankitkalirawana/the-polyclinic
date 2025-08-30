import { CreateUser, OrganizationUser } from '../common/user';
import { CreateOrganizationType, OrganizationType, UpdateOrganizationType } from './types';

import { fetchData } from '@/services/fetch';

export class OrganizationApi {
  private static readonly API_BASE = '/system/organizations';
  static async getAll() {
    return await fetchData<OrganizationType[]>(this.API_BASE);
  }

  // Get organization by ID
  static async getById(organizationId: string) {
    return await fetchData<{
      organization: OrganizationType;
      users: OrganizationUser[];
    }>(`${this.API_BASE}/${organizationId}`);
  }

  // Create organization
  static async create(organization: CreateOrganizationType) {
    return await fetchData<OrganizationType>(this.API_BASE, {
      method: 'POST',
      data: organization,
    });
  }

  // Update organization
  static async update(organizationId: string, organization: UpdateOrganizationType) {
    return await fetchData<unknown>(`${this.API_BASE}/${organizationId}`, {
      method: 'PUT',
      data: organization,
    });
  }

  // Delete organization
  static async delete(organizationId: string) {
    return await fetchData<OrganizationType>(`${this.API_BASE}/${organizationId}`, {
      method: 'DELETE',
    });
  }

  // Toggle organization status
  static async toggleStatus(organizationId: string, status: 'active' | 'inactive') {
    return await fetchData<OrganizationType>(`${this.API_BASE}/${organizationId}/status`, {
      method: 'PATCH',
      data: { status },
    });
  }

  // User related
  static async getAllUser(organizationId: string) {
    return await fetchData<OrganizationUser[]>(`${this.API_BASE}/${organizationId}/users`);
  }

  static async createUser(organizationId: string, user: CreateUser) {
    return await fetchData<OrganizationUser>(`${this.API_BASE}/${organizationId}/users`, {
      method: 'POST',
      data: user,
    });
  }

  static async updateUser(organizationId: string, userId: string, user: Partial<CreateUser>) {
    return await fetchData<OrganizationUser>(`${this.API_BASE}/${organizationId}/users/${userId}`, {
      method: 'PUT',
      data: user,
    });
  }

  static async deleteUser(organizationId: string, userId: string) {
    return await fetchData<void>(`${this.API_BASE}/${organizationId}/users/${userId}`, {
      method: 'DELETE',
    });
  }
}
