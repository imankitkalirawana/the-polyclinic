import { ValuesOf } from '@/libs/utils';
import { createOrganizationSchema, updateOrganizationSchema } from './organization.validation';

import { Base } from '@/types';
import { z } from 'zod';
import { ORGANIZATION_STATUSES } from './organization.constants';

export type OrganizationStatus = ValuesOf<typeof ORGANIZATION_STATUSES>;

// from zod validation
export type CreateOrganizationType = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationType = z.infer<typeof updateOrganizationSchema>;

export type OrganizationType = Base &
  CreateOrganizationType & {
    status: OrganizationStatus;
    subscriptionId: string | null;
  };
