import { z } from 'zod';
import { emailValidation, otpValidation } from '../factory.dto';
import { VerificationType } from '../../enums';

export const verifyOtpSchema = z.object({
  email: emailValidation,
  otp: otpValidation,
  type: z.enum(VerificationType),
});

export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
