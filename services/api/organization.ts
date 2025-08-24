'use server';
import { CreateOrganization, UpdateOrganization } from '@/types/organization';

import { auth } from '@/auth';
import { headers } from 'next/headers';

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
