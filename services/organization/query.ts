import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { CreateOrganizationType, OrganizationType, UpdateOrganizationType } from './types';
import { addToast } from '@heroui/react';
import { OrganizationApi } from './api';
import { OrganizationUser } from '../common/user';

// React Query hooks
export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await OrganizationApi.getAll();
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
  users: OrganizationUser[];
}> => {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: async () => {
      const response = await OrganizationApi.getById(id);
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
      const response = await OrganizationApi.create(data);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      addToast({
        title: 'Organization created successfully',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: error instanceof Error ? error.message : 'Failed to create organization',
        color: 'danger',
      });
    },
  });
};

export const useUpdateOrganization = (): UseMutationResult<
  unknown,
  Error,
  { id: string; data: UpdateOrganizationType }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrganizationType }) => {
      const response = await OrganizationApi.update(id, data);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: (_, variables) => {
      addToast({
        title: 'Organization updated successfully',
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.id] });
    },
    onError: (error) => {
      addToast({
        title: error instanceof Error ? error.message : 'Failed to update organization',
        color: 'danger',
      });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await OrganizationApi.delete(id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      addToast({
        title: 'Organization deleted successfully',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: error instanceof Error ? error.message : 'Failed to delete organization',
        color: 'danger',
      });
    },
  });
};
