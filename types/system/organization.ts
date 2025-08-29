import { ValuesOf } from '@/lib/utils';
import {
  createOrganizationSchema,
  createOrganizationUserSchema,
  updateOrganizationSchema,
  updateOrganizationUserSchema,
} from '@/services/organization/validation';

import { Base } from '@/types';
import { z } from 'zod';

export const organizationStatuses = ['active', 'inactive'] as const;
export const organizationUserRoles = [
  'admin',
  'doctor',
  'nurse',
  'patient',
  'receptionist',
  'pharmacist',
] as const;
export const organizationUserStatuses = ['active', 'inactive'] as const;

export type OrganizationType = Base & {
  organizationId: string;
  name: string;
  domain: string;
  logoUrl: string | null;
  status: OrganizationStatus;
  subscriptionId: string | null;
};

export type OrganizationStatus = ValuesOf<typeof organizationStatuses>;

export type OrganizationUserRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'patient'
  | 'receptionist'
  | 'pharmacist';

type OrganizationUserStatus = 'active' | 'inactive';

export type OrganizationUserType = Base & {
  uid: string;
  name: string;
  email: string;
  organization: string;
  phone: string;
  image: string;
  role: OrganizationUserRole;
  status: OrganizationUserStatus;
};

// from zod validation
export type CreateOrganizationType = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationType = z.infer<typeof updateOrganizationSchema>;

export type CreateOrganizationUser = z.infer<typeof createOrganizationUserSchema>;
export type UpdateOrganizationUser = z.infer<typeof updateOrganizationUserSchema>;
