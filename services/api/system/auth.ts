import { fetchData } from '..';
import { RegistrationRequest, SendOTPRequest, VerifyOTPRequest } from '@/services/auth';
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

  static async verifyEmail(email: string) {
    return await fetchData('/verify-email', {
      baseUrl: this.baseUrl,
      method: 'POST',
      data: { email },
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
}
