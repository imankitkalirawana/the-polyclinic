import {
  LoginRequest,
  RegistrationRequest,
  ResetPasswordRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from '@/services/common/auth';
import { RegistrationResponse, VerifyOTPResponse } from './auth.types';
import { apiRequest } from '@/lib/axios';

export class AuthApi {
  private static baseUrl = '/client/auth';

  static async login(data: LoginRequest) {
    const res = await apiRequest<{ token: string }>({
      url: `${this.baseUrl}/login`,
      method: 'POST',
      data,
    });
    console.log('res', res);
    return res;
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

  static async resetPassword(data: ResetPasswordRequest) {
    return await apiRequest({
      url: `${this.baseUrl}/reset-password`,
      method: 'POST',
      data,
    });
  }

  static async logout() {
    return await apiRequest({
      url: `${this.baseUrl}/logout`,
      method: 'POST',
    });
  }
}
