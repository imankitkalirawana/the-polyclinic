import {
  CreateOrganizationType,
  CreateOrganizationUser,
  OrganizationType,
  OrganizationUserType,
  UpdateOrganizationType,
} from '@/types/organization';

import { fetchData } from '.';

const API_BASE = '/system/organizations';

export const organizationApi = {
  async getAll() {
    return await fetchData<OrganizationType[]>(API_BASE);
  },

  // Get organization by ID
  async getById(organizationId: string) {
    return await fetchData<{
      organization: OrganizationType;
      users: OrganizationUserType[];
    }>(`${API_BASE}/${organizationId}`);
  },

  // Create organization
  async create(organization: CreateOrganizationType) {
    return await fetchData<OrganizationType>(API_BASE, {
      method: 'POST',
      data: organization,
    });
  },

  // Update organization
  async update(organizationId: string, organization: UpdateOrganizationType) {
    return await fetchData<OrganizationType>(`${API_BASE}/${organizationId}`, {
      method: 'PUT',
      data: organization,
    });
  },

  // Delete organization
  async delete(organizationId: string) {
    return await fetchData<OrganizationType>(`${API_BASE}/${organizationId}`, {
      method: 'DELETE',
    });
  },

  // Toggle organization status
  async toggleStatus(organizationId: string, status: 'active' | 'inactive') {
    return await fetchData<OrganizationType>(`${API_BASE}/${organizationId}/status`, {
      method: 'PATCH',
      data: { status },
    });
  },

  // User related
  users: {
    async create(organizationId: string, user: CreateOrganizationUser) {
      return await fetchData<OrganizationUserType>(`${API_BASE}/${organizationId}/users`, {
        method: 'POST',
        data: user,
      });
    },

    async update(organizationId: string, userId: string, user: Partial<CreateOrganizationUser>) {
      return await fetchData<OrganizationUserType>(
        `${API_BASE}/${organizationId}/users/${userId}`,
        {
          method: 'PUT',
          data: user,
        }
      );
    },

    async delete(organizationId: string, userId: string) {
      return await fetchData<void>(`${API_BASE}/${organizationId}/users/${userId}`, {
        method: 'DELETE',
      });
    },
  },
};
