import {
  CreateOrganizationType,
  OrganizationType,
  UpdateOrganizationType,
} from '@/types/organization';

import { fetchData } from '.';

const API_BASE = '/organizations';
export const organizationApi = {
  async getAll() {
    return await fetchData<OrganizationType[]>(API_BASE);
  },

  // Get organization by ID
  async getById(id: string) {
    return await fetchData<OrganizationType>(`${API_BASE}/${id}`);
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
};
