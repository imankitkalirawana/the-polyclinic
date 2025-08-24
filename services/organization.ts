import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  CreateOrganizationType,
  OrganizationType,
  UpdateOrganizationType,
} from '@/types/organization';
import { addToast } from '@heroui/react';
import { organizationApi } from './api/organization';
import { UserType } from '@/types/user';

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

export const useOrganization = (
  id: string
): UseQueryResult<{
  organization: OrganizationType;
  users: UserType[];
}> => {
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
      queryClient.invalidateQueries({ queryKey: ['organizations', data.organizationId] });
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
      queryClient.invalidateQueries({ queryKey: ['organizations', data.organizationId] });
    },
  });
};

// Legacy service for backward compatibility
export const organizationService = organizationApi;
