import { UserType } from '@/services/common/user/user.types';
import {
  CreateOrganizationType,
  OrganizationType,
  UpdateOrganizationType,
} from './organization.types';

import { apiRequest } from '@/libs/axios';

export class OrganizationApi {
  private static readonly API_BASE = '/system/organizations';
  static async getAll() {
    return await apiRequest<OrganizationType[]>({
      url: this.API_BASE,
    });
  }

  // Get organization by ID
  static async getById(organizationId: string) {
    return await apiRequest<{
      organization: OrganizationType;
      users: UserType[];
    }>({
      url: `${this.API_BASE}/${organizationId}`,
    });
  }

  // Create organization
  static async create(organization: CreateOrganizationType) {
    return await apiRequest<OrganizationType>({
      url: this.API_BASE,
      method: 'POST',
      data: organization,
    });
  }

  // Update organization
  static async update(organizationId: string, organization: UpdateOrganizationType) {
    return await apiRequest<unknown>({
      url: `${this.API_BASE}/${organizationId}`,
      method: 'PUT',
      data: organization,
    });
  }

  // Delete organization
  static async delete(organizationId: string) {
    return await apiRequest<OrganizationType>({
      url: `${this.API_BASE}/${organizationId}`,
      method: 'DELETE',
    });
  }

  // Toggle organization status
  static async toggleStatus(organizationId: string, status: 'active' | 'inactive') {
    return await apiRequest<OrganizationType>({
      url: `${this.API_BASE}/${organizationId}/status`,
      method: 'PUT',
      data: { status },
    });
  }
}
