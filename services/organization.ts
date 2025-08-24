import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  acceptInvitation,
  addMember,
  createOrganization,
  deleteOrganization,
  getInvitationById,
  inviteMember,
  listInvitations,
  listOrganizations,
  OrganizationRole,
  updateOrganization,
} from './api/organization';
import { Invitation, Member, Organization } from 'better-auth/plugins';
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

export const useListInvitations = (organizationId?: string): UseQueryResult<Invitation[]> =>
  useQuery({
    queryKey: ['invitations', organizationId],
    queryFn: async () => {
      const data = await listInvitations(organizationId);
      if (data) {
        return data;
      }
      throw new Error('Failed to fetch invitations');
    },
  });

export const useGetInvitationById = (
  id: string,
  organizationSlug: string
): UseQueryResult<Invitation> =>
  useQuery({
    queryKey: ['invitation', id],
    queryFn: async () => {
      const data = await getInvitationById({ id, organizationSlug });
      if (data.success) {
        return data.data;
      }
      throw new Error('Failed to fetch invitation');
    },
  });

export const useInviteMember = (): UseMutationResult<
  Invitation,
  Error,
  { email: string; role: OrganizationRole; organizationId: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      role,
      organizationId,
    }: {
      email: string;
      role: OrganizationRole;
      organizationId: string;
    }) => {
      const invitedData = await inviteMember({ email, role, organizationId });
      if (invitedData) {
        return invitedData;
      }
      throw new Error('Failed to invite member');
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', organizationId] });
      addToast({
        title: 'Member invited',
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

export const useAcceptInvitation = (): UseMutationResult<
  { invitation: Invitation; member: Member },
  Error,
  { invitationId: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invitationId }: { invitationId: string }) => {
      const acceptedData = await acceptInvitation({ invitationId });
      if (acceptedData) {
        return acceptedData;
      }
      throw new Error('Failed to accept invitation');
    },
    onSuccess: (_, { invitationId }) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', invitationId] });
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

export const useAddMember = (): UseMutationResult<
  Member,
  Error,
  { userId: string; role: OrganizationRole; organizationId: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      role,
      organizationId,
    }: {
      userId: string;
      role: OrganizationRole;
      organizationId: string;
    }) => {
      const addedData = await addMember({ userId, role, organizationId });
      if (addedData) {
        return addedData;
      }
      throw new Error('Failed to add member');
    },
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', organizationId] });
      addToast({
        title: 'Member added',
        color: 'success',
      });
    },
  });
};
