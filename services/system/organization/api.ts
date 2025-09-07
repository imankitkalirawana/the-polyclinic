import { OrganizationUser } from '@/services/common/user';
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
}
