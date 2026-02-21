import { z } from 'zod';
import { otpValidation, passwordValidation } from '../factory.dto';

export const confirmResetPasswordSchema = z.object({
  email: z.email(),
  password: passwordValidation,
  otp: otpValidation,
});

export type ConfirmResetPasswordDto = z.infer<typeof confirmResetPasswordSchema>;
