import { z } from 'zod';
import { emailValidation } from '../factory.dto';

export const resetPasswordSchema = z.object({
  email: emailValidation,
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
