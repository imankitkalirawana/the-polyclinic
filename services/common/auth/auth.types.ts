import { Role } from '@/services/common/user/user.constants';

export interface VerifyOTPResponse {
  token: string;
  email: string;
  type: string;
}

export interface RegistrationResponse {
  email: string;
  name: string;
  role: Role;
  uid: string;
  organization: string;
}
