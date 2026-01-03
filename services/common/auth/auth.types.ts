import { OrganizationUser } from '@/services/common/user';

export interface VerifyOTPResponse {
  token: string;
  email: string;
  type: string;
}

export interface RegistrationResponse {
  email: string;
  name: string;
  role: OrganizationUser['role'];
  uid: string;
  organization: string;
}
