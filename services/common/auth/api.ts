import { fetchData } from '../../fetch';
import {
  RegistrationRequest,
  ResetPasswordRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from '@/services/common/auth';
import { RegistrationResponse, VerifyOTPResponse } from './types';

export class AuthApi {
  static baseUrl = '/auth';

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

  static async verifyEmail(data: { email: string; subdomain?: string | null }) {
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
