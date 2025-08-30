import { ValuesOf } from '@/lib/utils';
import { createOrganizationSchema, updateOrganizationSchema } from './validation';

import { Base } from '@/types';
import { z } from 'zod';
import { ORGANIZATION_STATUSES } from './constants';

export type OrganizationType = Base & {
  organizationId: string;
  name: string;
  domain: string;
  logoUrl: string | null;
  status: OrganizationStatus;
  subscriptionId: string | null;
};

export type OrganizationStatus = ValuesOf<typeof ORGANIZATION_STATUSES>;

// from zod validation
export type CreateOrganizationType = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationType = z.infer<typeof updateOrganizationSchema>;
