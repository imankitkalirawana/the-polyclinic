import {
  CreateOrganizationType,
  CreateOrganizationUser,
  OrganizationType,
  OrganizationUser,
  UpdateOrganizationType,
} from '@/types/organization';

import { fetchData } from '.';
import { UserType } from '@/types/user';

const API_BASE = '/organizations';
export const organizationApi = {
  async getAll() {
    return await fetchData<OrganizationType[]>(API_BASE);
  },

  // Get organization by ID
  async getById(id: string) {
    return await fetchData<{
      organization: OrganizationType;
      users: UserType[];
    }>(`${API_BASE}/${id}`);
  },

  // Create organization
  async create(organization: CreateOrganizationType) {
    return await fetchData<OrganizationType>(API_BASE, {
      method: 'POST',
      data: organization,
    });
  },

  // Update organization
  async update(id: string, organization: UpdateOrganizationType) {
    return await fetchData<OrganizationType>(`${API_BASE}/${id}`, {
      method: 'PUT',
      data: organization,
    });
  },

  // Delete organization
  async delete(id: string) {
    return await fetchData<OrganizationType>(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle organization status
  async toggleStatus(id: string, status: 'active' | 'inactive') {
    return await fetchData<OrganizationType>(`${API_BASE}/${id}/status`, {
      method: 'PATCH',
      data: { status },
    });
  },

  // user related
  async createUser(id: string, user: CreateOrganizationUser) {
    return await fetchData<OrganizationUser>(`${API_BASE}/${id}/create-user`, {
      method: 'POST',
      data: user,
    });
  },

  async updateUser(organizationId: string, userId: string, user: Partial<CreateOrganizationUser>) {
    return await fetchData<OrganizationUser>(`${API_BASE}/${organizationId}/users/${userId}`, {
      method: 'PUT',
      data: user,
    });
  },

  async deleteUser(organizationId: string, userId: string) {
    return await fetchData<void>(`${API_BASE}/${organizationId}/users/${userId}`, {
      method: 'DELETE',
    });
  },
};
