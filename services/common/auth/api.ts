import {
  LoginRequest,
  RegistrationRequest,
  ResetPasswordRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from '@/services/common/auth';
import { RegistrationResponse, VerifyOTPResponse } from './types';
import { apiRequest } from '@/lib/axios';

export class AuthApi {
  static baseUrl = '/auth';

  static async login(data: LoginRequest) {
    return await apiRequest<{ token: string }>({
      url: `${this.baseUrl}/login`,
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

  static async verifyEmail(data: { email: string }) {
    return await apiRequest<{ exists: boolean }>({
      url: `${this.baseUrl}/verify-email`,
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

  static async resetPassword(data: ResetPasswordRequest) {
    return await apiRequest({
      url: `${this.baseUrl}/reset-password`,
      method: 'POST',
      data,
    });
  }
}
