import { ValuesOf } from '@/lib/utils';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
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

export type CreateOrganizationUser = Partial<
  Omit<
    OrganizationUserType,
    | '_id'
    | 'createdAt'
    | 'updatedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'organization'
    | 'status'
    | 'uid'
  >
> & {
  password?: string;
};

export type UpdateOrganizationUser = Partial<
  Omit<OrganizationUserType, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'uid'>
> & {
  password?: string;
};

// from zod validation
export type CreateOrganizationType = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationType = z.infer<typeof updateOrganizationSchema>;
