import { fetchData } from '../../fetch';
import {
  RegistrationRequest,
  ResetPasswordRequest,
  SendOTPRequest,
  VerifyOTPRequest,
} from '@/services/common/auth';
import { RegistrationResponse, VerifyOTPResponse } from './types';

export class AuthApi {
  static baseUrl = process.env.NEXT_PUBLIC_API_URL + '/api/auth';

  static async sendOTP(data: SendOTPRequest) {
    return await fetchData('/send-otp', {
      baseUrl: this.baseUrl,
      method: 'POST',
      data,
    });
  }

  static async verifyOTP(data: VerifyOTPRequest) {
    return await fetchData<VerifyOTPResponse>('/verify-otp', {
      baseUrl: this.baseUrl,
      method: 'POST',
      data,
    });
  }

  static async registerUser(data: RegistrationRequest) {
    return await fetchData<RegistrationResponse>('/register', {
      baseUrl: this.baseUrl,
      method: 'POST',
      data,
    });
  }

  static async resetPassword(data: ResetPasswordRequest) {
    return await fetchData('/reset-password', {
      baseUrl: this.baseUrl,
      method: 'POST',
      data,
    });
  }
}
