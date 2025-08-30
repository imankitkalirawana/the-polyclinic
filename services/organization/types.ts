import { ValuesOf } from '@/lib/utils';
import {
  createOrganizationSchema,
  createOrganizationUserSchema,
  updateOrganizationSchema,
  updateOrganizationUserSchema,
} from './validation';

import { Base } from '@/types';
import { z } from 'zod';
import {
  ORGANIZATION_STATUSES,
  ORGANIZATION_USER_ROLES,
  ORGANIZATION_USER_STATUSES,
} from './constants';

export type OrganizationType = Base & {
  organizationId: string;
  name: string;
  domain: string;
  logoUrl: string | null;
  status: OrganizationStatus;
  subscriptionId: string | null;
};

export type OrganizationUserType = Base & {
  uid: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  role: OrganizationUserRole;
  status: OrganizationUserStatus;
};

export type OrganizationStatus = ValuesOf<typeof ORGANIZATION_STATUSES>;
export type OrganizationUserRole = ValuesOf<typeof ORGANIZATION_USER_ROLES>;
export type OrganizationUserStatus = ValuesOf<typeof ORGANIZATION_USER_STATUSES>;

// from zod validation
export type CreateOrganizationType = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationType = z.infer<typeof updateOrganizationSchema>;

export type CreateOrganizationUser = z.infer<typeof createOrganizationUserSchema>;
export type UpdateOrganizationUser = z.infer<typeof updateOrganizationUserSchema>;
