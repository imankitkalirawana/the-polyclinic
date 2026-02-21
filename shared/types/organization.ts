import { Base } from './common';

export type OrganizationStatus = 'active' | 'inactive';

export type OrganizationDetails = {
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
};

export type Organization = Base & {
  name: string;
  organizationId: string;
  logoUrl?: string;
  organizationDetails?: OrganizationDetails;
  status: OrganizationStatus;
  subscriptionId: string | null;
};
