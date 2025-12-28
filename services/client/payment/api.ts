import { apiRequest } from '@/lib/axios';
import { VerifyPaymentRequest } from './types';

export class PaymentApi {
  private static API_BASE = '/client/payments';

  static async verifyPayment(data: VerifyPaymentRequest) {
    return await apiRequest({
      url: `${this.API_BASE}/verify`,
      method: 'POST',
      data,
    });
  }
}
