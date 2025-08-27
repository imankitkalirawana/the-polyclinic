import { OrganizationUserRole } from '@/types/system/organization';

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
