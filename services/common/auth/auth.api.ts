import {
  LoginRequest,
  RegistrationRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from './auth.validation';
import { RegistrationResponse, VerifyOTPResponse } from './auth.types';
import { apiRequest } from '@/lib/axios';
import { ForgotPasswordRequest } from './auth.validation';

export class AuthApi {
  private static baseUrl = '/auth';

  static async login(data: LoginRequest) {
    const res = await apiRequest<{ token: string }>({
      url: `${this.baseUrl}/login`,
      method: 'POST',
      data,
    });
    return res;
  }

  static async sendOTP(data: SendOTPRequest) {
    return await apiRequest({
      url: `${this.baseUrl}/otp/request`,
      method: 'POST',
      data,
    });
  }

  static async verifyOTP(data: VerifyOTPRequest) {
    return await apiRequest<VerifyOTPResponse>({
      url: `${this.baseUrl}/otp/verify`,
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
      url: `${this.baseUrl}/forgot-password`,
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
