import { z } from 'zod';
import { VerificationType } from '../../enums/auth.enum';

export const sendOtpSchema = z.object({
  email: z.email(),

  type: z.enum(VerificationType),
});

export type SendOtpDto = z.infer<typeof sendOtpSchema>;
