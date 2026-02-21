import { z } from 'zod';
import { PaymentCurrency, PaymentReferenceType } from '../../enums';

export const createPaymentSchema = z.object({
  referenceId: z.string(),
  amount: z.number(),
  currency: z.enum(PaymentCurrency),
  referenceType: z.enum(PaymentReferenceType),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
