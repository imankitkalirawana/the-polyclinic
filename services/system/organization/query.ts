import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateOrganizationType, UpdateOrganizationType } from './types';
import { addToast } from '@heroui/react';
import { OrganizationApi } from './api';

// React Query hooks
export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const result = await OrganizationApi.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });
};

export const useOrganization = (id: string) =>
  useQuery({
    queryKey: ['organizations', id],
    queryFn: async () => {
      const result = await OrganizationApi.getById(id);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!id,
  });

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrganizationType) => {
      const result = await OrganizationApi.create(data);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      addToast({
        title: result.message,
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrganizationType }) => {
      const result = await OrganizationApi.update(id, data);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (result, variables) => {
      addToast({
        title: result.message,
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.id] });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await OrganizationApi.delete(id);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      addToast({
        title: result.message,
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};
