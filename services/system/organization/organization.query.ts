import { CreateOrganizationType, UpdateOrganizationType } from './organization.types';
import { OrganizationApi } from './organization.api';
import { useGenericQuery } from '@/services/useGenericQuery';
import { useGenericMutation } from '@/services/useGenericMutation';

// React Query hooks
export const useOrganizations = () => {
  return useGenericQuery({
    queryKey: ['organizations'],
    queryFn: () => OrganizationApi.getAll(),
  });
};

export const useOrganization = (id: string) =>
  useGenericQuery({
    queryKey: ['organizations', id],
    queryFn: () => OrganizationApi.getById(id),
    enabled: !!id,
  });

export const useCreateOrganization = () => {
  return useGenericMutation({
    mutationFn: (data: CreateOrganizationType) => OrganizationApi.create(data),
    invalidateQueries: [['organizations']],
  });
};

export const useUpdateOrganization = () => {
  return useGenericMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationType }) =>
      OrganizationApi.update(id, data),
    invalidateQueriesWithVariables: ({ variables }) => [
      ['organizations'],
      ['organizations', variables?.id],
    ],
  });
};
export const useDeleteOrganization = () => {
  return useGenericMutation({
    mutationFn: (id: string) => OrganizationApi.delete(id),
    invalidateQueries: [['organizations']],
    invalidateQueriesWithVariables: ({ variables }) => [['organizations', variables]],
  });
};
