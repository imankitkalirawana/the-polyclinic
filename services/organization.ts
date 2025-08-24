import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  createOrganization,
  deleteOrganization,
  listOrganizations,
  updateOrganization,
} from './api/organization';
import { Organization } from 'better-auth/plugins';
import { CreateOrganization, UpdateOrganization } from '@/types/organization';
import { addToast } from '@heroui/react';

export const useListOrganizations = (): UseQueryResult<Organization[]> =>
  useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const data = await listOrganizations();
      if (data) {
        return data;
      }
      throw new Error('Failed to fetch organizations');
    },
  });

export const useCreateOrganization = (): UseMutationResult<
  Organization,
  Error,
  CreateOrganization
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateOrganization) => {
      const data = await createOrganization(body);
      if (data) {
        return data;
      }
      throw new Error('Failed to create organization');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      addToast({
        title: 'Organization created',
        description: 'Organization created successfully',
        color: 'success',
      });
    },
  });
};

export const useUpdateOrganization = (): UseMutationResult<
  Organization,
  Error,
  { data: UpdateOrganization; organizationId: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      organizationId,
    }: {
      data: UpdateOrganization;
      organizationId: string;
    }) => {
      const updatedData = await updateOrganization({ data, organizationId });
      if (updatedData) {
        return updatedData;
      }
      throw new Error('Failed to update organization');
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      addToast({
        title: 'Organization updated',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: 'Error',
        description: error.message,
        color: 'danger',
      });
    },
  });
};

export const useDeleteOrganization = (): UseMutationResult<
  Organization,
  Error,
  { organizationId: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ organizationId }: { organizationId: string }) => {
      const deletedData = await deleteOrganization({ organizationId });
      if (deletedData) {
        return deletedData;
      }
      throw new Error('Failed to delete organization');
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      addToast({
        title: 'Organization deleted',
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: 'Error',
        description: error.message,
        color: 'danger',
      });
    },
  });
};
