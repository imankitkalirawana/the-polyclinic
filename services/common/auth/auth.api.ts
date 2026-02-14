import {
  ForgotPasswordRequest,
  GoogleLoginRequest,
  GoogleLoginResponse,
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  SendOTPRequest,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './auth.types';
import { apiRequest } from '@/libs/axios';
import { Session } from '@/types/session';

export class AuthApi {
  private static baseUrl = '/auth';

  static async login(data: LoginRequest) {
    const res = await apiRequest<LoginResponse>({
      url: `${this.baseUrl}/login`,
      method: 'POST',
      data,
    });
    return res;
  }

  /**
   * Exchange Google ID token (credential) for app session token.
   * Backend verifies the credential with Google and returns same token shape as email login.
   */
  static async loginWithGoogle(data: GoogleLoginRequest) {
    return await apiRequest<GoogleLoginResponse>({
      url: `${this.baseUrl}/google`,
      method: 'POST',
      data,
    });
  }

  static async sendOTP(data: SendOTPRequest) {
    return await apiRequest({
      url: `${this.baseUrl}/send-otp`,
      method: 'POST',
      data,
    });
  }

  static async verifyOTP(data: VerifyOTPRequest) {
    return await apiRequest<VerifyOTPResponse>({
      url: `${this.baseUrl}/verify-otp`,
      method: 'POST',
      data,
    });
  }

  static async checkEmail(data: { email: string }) {
    return await apiRequest<{ exists: boolean }>({
      url: `${this.baseUrl}/check-email`,
      method: 'POST',
      data,
    });
  }

  static async registerUser(data: RegistrationRequest) {
    return await apiRequest<RegistrationResponse>({
      url: `${this.baseUrl}/register`,
      method: 'POST',
      data,
    });
  }

  static async forgotPassword(data: ForgotPasswordRequest) {
    return await apiRequest({
      url: `${this.baseUrl}/reset-password`,
      method: 'POST',
      data,
    });
  }

  static async logout() {
    return await apiRequest({
      url: `${this.baseUrl}/logout`,
      method: 'DELETE',
    });
  }

  static async getSession() {
    return await apiRequest<Session>({
      url: `${this.baseUrl}/session`,
      method: 'GET',
    });
  }
}
