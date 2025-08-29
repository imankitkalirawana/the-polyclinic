import {
  CreateOrganizationType,
  CreateOrganizationUser,
  OrganizationType,
  OrganizationUserType,
  UpdateOrganizationType,
} from '@/types/system/organization';

import { fetchData } from '@/services/fetch';

const API_BASE = '/system/organizations';

export class OrganizationApi {
  static async getAll() {
    return await fetchData<OrganizationType[]>(API_BASE);
  }

  // Get organization by ID
  static async getById(organizationId: string) {
    return await fetchData<{
      organization: OrganizationType;
      users: OrganizationUserType[];
    }>(`${API_BASE}/${organizationId}`);
  }

  // Create organization
  static async create(organization: CreateOrganizationType) {
    return await fetchData<OrganizationType>(API_BASE, {
      method: 'POST',
      data: organization,
    });
  }

  // Update organization
  static async update(organizationId: string, organization: UpdateOrganizationType) {
    return await fetchData<unknown>(`${API_BASE}/${organizationId}`, {
      method: 'PUT',
      data: organization,
    });
  }

  // Delete organization
  static async delete(organizationId: string) {
    return await fetchData<OrganizationType>(`${API_BASE}/${organizationId}`, {
      method: 'DELETE',
    });
  }

  // Toggle organization status
  static async toggleStatus(organizationId: string, status: 'active' | 'inactive') {
    return await fetchData<OrganizationType>(`${API_BASE}/${organizationId}/status`, {
      method: 'PATCH',
      data: { status },
    });
  }

  // User related
  static async getAllUser(organizationId: string) {
    return await fetchData<OrganizationUserType[]>(`${API_BASE}/${organizationId}/users`);
  }

  static async createUser(organizationId: string, user: CreateOrganizationUser) {
    return await fetchData<OrganizationUserType>(`${API_BASE}/${organizationId}/users`, {
      method: 'POST',
      data: user,
    });
  }

  static async updateUser(
    organizationId: string,
    userId: string,
    user: Partial<CreateOrganizationUser>
  ) {
    return await fetchData<OrganizationUserType>(`${API_BASE}/${organizationId}/users/${userId}`, {
      method: 'PUT',
      data: user,
    });
  }

  static async deleteUser(organizationId: string, userId: string) {
    return await fetchData<void>(`${API_BASE}/${organizationId}/users/${userId}`, {
      method: 'DELETE',
    });
  }
}
