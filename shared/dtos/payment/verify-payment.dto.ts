import { z } from 'zod';

export const verifyPaymentSchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
});

export type VerifyPaymentDto = z.infer<typeof verifyPaymentSchema>;
