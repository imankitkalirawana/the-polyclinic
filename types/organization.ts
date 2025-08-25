import { Base } from '@/lib/interface';
import { ValuesOf } from '@/lib/utils';

export const organizationStatuses = ['active', 'inactive'] as const;

export interface OrganizationType extends Base {
  organizationId: string;
  name: string;
  domain: string;
  logoUrl: string | null;
  status: OrganizationStatus;
  subscriptionId: string | null;
}

export type CreateOrganizationType = Pick<
  OrganizationType,
  'name' | 'domain' | 'logoUrl' | 'status'
>;

export type UpdateOrganizationType = Partial<CreateOrganizationType>;

export type OrganizationStatus = ValuesOf<typeof organizationStatuses>;

export type OrganizationUserRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'patient'
  | 'receptionist'
  | 'pharmacist';

export type OrganizationUserStatus = 'active' | 'inactive';

export type OrganizationUser = Base & {
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
    OrganizationUser,
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
