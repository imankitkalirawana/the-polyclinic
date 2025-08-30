import { OrganizationUserRole } from '@/services/organization/types';

export interface VerifyOTPResponse {
  token: string;
  email: string;
  type: string;
}

export interface RegistrationResponse {
  email: string;
  name: string;
  role: OrganizationUserRole;
  uid: string;
  organization: string;
}
