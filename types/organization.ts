import { Organization } from 'better-auth/plugins';

export type CreateOrganization = Omit<Organization, 'id' | 'createdAt'> & {
  userId?: string;
  keepCurrentActiveOrganization?: boolean;
};

export type UpdateOrganization = {
  name?: string;
  slug?: string;
  logo?: string;
  metadata?: Record<string, unknown>;
};
