'use server';
import { CreateOrganization, UpdateOrganization } from '@/types/organization';

import { auth } from '@/auth';
import { headers } from 'next/headers';
import { fetchData } from '.';
import { Invitation } from 'better-auth/plugins';

// Define organization roles that match the API expectations
export type OrganizationRole = 'admin' | 'member' | 'owner';

export const listOrganizations = async () => {
  return await auth.api.listOrganizations({
    headers: await headers(),
  });
};

export const getFullOrganization = async ({
  organizationId,
  organizationSlug,
  membersLimit,
}: {
  organizationId?: string;
  organizationSlug?: string;
  membersLimit?: number;
}) => {
  return await auth.api.getFullOrganization({
    query: {
      organizationId,
      organizationSlug,
      membersLimit,
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });
};

export const createOrganization = async (body: CreateOrganization) => {
  const { name, slug, logo, metadata, userId, keepCurrentActiveOrganization } = body;
  return await auth.api.createOrganization({
    body: {
      name,
      slug,
      logo: logo ?? undefined,
      metadata,
      userId,
      keepCurrentActiveOrganization,
    },
    headers: await headers(),
  });
};

export const updateOrganization = async ({
  data,
  organizationId,
}: {
  data: UpdateOrganization;
  organizationId: string;
}) => {
  const { name, slug, logo, metadata } = data;
  return await auth.api.updateOrganization({
    body: {
      data: {
        name,
        slug,
        logo,
        metadata,
      },
      organizationId,
    },
    headers: await headers(),
  });
};

export const deleteOrganization = async ({ organizationId }: { organizationId: string }) => {
  return await auth.api.deleteOrganization({
    body: {
      organizationId,
    },
    headers: await headers(),
  });
};

export const listInvitations = async (organizationId?: string) => {
  return await auth.api.listInvitations({
    query: {
      organizationId,
    },
    headers: await headers(),
  });
};

export const inviteMember = async ({
  email,
  role,
  organizationId,
  resend,
}: {
  email: string;
  role: OrganizationRole;
  organizationId?: string;
  resend?: boolean;
}) => {
  return await auth.api.createInvitation({
    body: {
      email,
      role,
      organizationId,
      resend,
    },
    headers: await headers(),
  });
};

export const acceptInvitation = async ({ invitationId }: { invitationId: string }) => {
  return await auth.api.acceptInvitation({
    body: {
      invitationId,
    },
    headers: await headers(),
  });
};

export const cancelInvitation = async ({ invitationId }: { invitationId: string }) => {
  return await auth.api.cancelInvitation({
    body: {
      invitationId,
    },
    headers: await headers(),
  });
};

export const rejectInvitation = async ({ invitationId }: { invitationId: string }) => {
  return await auth.api.rejectInvitation({
    body: {
      invitationId,
    },
    headers: await headers(),
  });
};

export const getInvitationById = async ({
  id,
  organizationSlug,
}: {
  id: string;
  organizationSlug: string;
}) => {
  return await fetchData<Invitation>('/organizations/invitation', {
    method: 'POST',
    data: { id, organizationSlug },
  });
};

export const getInvitation = async ({ id }: { id: string }) => {
  return await auth.api.getInvitation({
    query: {
      id, // invitation id
    },
    headers: await headers(),
  });
};

export const listUserInvitations = async ({ email }: { email: string }) => {
  return await auth.api.listUserInvitations({
    query: {
      email,
    },
    headers: await headers(),
  });
};

/**
 * Members API functions
 */

type ListMembersQuery = {
  organizationId?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filterField?: string;
  filterOperator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';
  filterValue?: string;
};

export const listMembers = async ({
  organizationId,
  limit,
  offset,
  sortBy,
  sortDirection,
  filterField,
  filterOperator,
  filterValue,
}: ListMembersQuery) => {
  return await auth.api.listMembers({
    query: {
      organizationId,
      limit,
      offset,
      sortBy,
      sortDirection,
      filterField,
      filterOperator,
      filterValue,
    },
    headers: await headers(),
  });
};

export const addMember = async ({
  userId,
  role,
  organizationId,
}: {
  userId: string;
  role: OrganizationRole;
  organizationId?: string;
}) => {
  return await auth.api.addMember({
    body: {
      userId,
      role,
      organizationId,
    },
    headers: await headers(),
  });
};

/**
 * @link https://www.better-auth.com/docs/plugins/organization#remove-member
 */
export const removeMember = async ({
  memberIdOrEmail,
  organizationId,
}: {
  memberIdOrEmail: string;
  organizationId?: string;
}) => {
  return await auth.api.removeMember({
    body: {
      memberIdOrEmail,
      organizationId,
    },
    headers: await headers(),
  });
};

export const leaveOrganization = async ({ organizationId }: { organizationId: string }) => {
  return await auth.api.leaveOrganization({
    body: {
      organizationId,
    },
    headers: await headers(),
  });
};

export const updateMemberRole = async ({
  memberId,
  role,
  organizationId,
}: {
  memberId: string;
  role: OrganizationRole | OrganizationRole[];
  organizationId?: string;
}) => {
  return await auth.api.updateMemberRole({
    body: {
      memberId,
      role,
      organizationId,
    },
    headers: await headers(),
  });
};
