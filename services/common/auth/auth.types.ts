import { VerificationType } from './auth.enum';

export type RegistrationRequest = {
  email: string;
  password: string;
  name: string;
  otp: string;
  phone?: string;
};

export type RegistrationResponse = {
  token: string;
  expiresIn: number;
  schema: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type SendOTPRequest = {
  email: string;
  type: VerificationType;
};

export type VerifyOTPRequest = {
  email: string;
  otp: string;
  type: VerificationType;
};

export type VerifyOTPResponse = {
  verified: boolean;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  success: boolean;
};
