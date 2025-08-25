import { ValuesOf } from '@/lib/utils';
import { Base } from '.';

export const organizationStatuses = ['active', 'inactive'] as const;

export type OrganizationType = Base & {
  organizationId: string;
  name: string;
  domain: string;
  logoUrl: string | null;
  status: OrganizationStatus;
  subscriptionId: string | null;
};

export type CreateOrganizationType = Pick<
  OrganizationType,
  'name' | 'domain' | 'logoUrl' | 'status'
>;

export type UpdateOrganizationType = Partial<CreateOrganizationType>;

type OrganizationStatus = ValuesOf<typeof organizationStatuses>;

type OrganizationUserRole =
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
