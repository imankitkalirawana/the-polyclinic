import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchData } from './index';
import {
  OrganizationType,
  CreateOrganizationType,
  UpdateOrganizationType,
} from '@/types/organization';
import { addToast } from '@heroui/react';

const API_BASE = '/superadmin/organizations';

// API functions using the existing infrastructure
export const organizationApi = {
  // Get all organizations
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

// React Query hooks
export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await organizationApi.getAll();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: async () => {
      const response = await organizationApi.getById(id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrganizationType) => {
      const response = await organizationApi.create(data);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrganizationType }) => {
      const response = await organizationApi.update(id, data);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: (data) => {
      addToast({
        title: 'Organization updated successfully',
        description: 'Organization updated successfully',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', data._id] });
    },
    onError: (error) => {
      addToast({
        title: 'Failed to update organization',
        description: error instanceof Error ? error.message : 'Failed to update organization',
        color: 'danger',
      });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await organizationApi.delete(id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useToggleOrganizationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      const response = await organizationApi.toggleStatus(id, status);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', data._id] });
    },
  });
};

// Legacy service for backward compatibility
export const organizationService = organizationApi;
