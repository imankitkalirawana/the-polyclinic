import { fetchData } from '../../fetch';
import {
  LoginRequest,
  RegistrationRequest,
  ResetPasswordRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from '@/services/common/auth';
import { RegistrationResponse, VerifyOTPResponse } from './types';
import { UnifiedUser } from '../user';

export class AuthApi {
  static baseUrl = '/auth';

  static async login(data: LoginRequest) {
    return await fetchData<UnifiedUser>(`${this.baseUrl}/login`, {
      method: 'POST',
      data,
    });
  }

  static async sendOTP(data: SendOTPRequest) {
    return await fetchData(`${this.baseUrl}/send-otp`, {
      method: 'POST',
      data,
    });
  }

  static async verifyOTP(data: VerifyOTPRequest) {
    return await fetchData<VerifyOTPResponse>(`${this.baseUrl}/verify-otp`, {
      method: 'POST',
      data,
    });
  }

  static async verifyEmail(data: { email: string }) {
    return await fetchData<{ exists: boolean }>(`${this.baseUrl}/verify-email`, {
      method: 'POST',
      data,
    });
  }

  static async registerUser(data: RegistrationRequest) {
    return await fetchData<RegistrationResponse>(`${this.baseUrl}/register`, {
      method: 'POST',
      data,
    });
  }

  static async resetPassword(data: ResetPasswordRequest) {
    return await fetchData(`${this.baseUrl}/reset-password`, {
      method: 'POST',
      data,
    });
  }
}
