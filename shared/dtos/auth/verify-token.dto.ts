import { z } from 'zod';
import { emailValidation } from '../factory.dto';
import { VerificationType } from '../../enums';

export const verifyTokenSchema = z.object({
  email: emailValidation,
  token: z
    .string()
    .length(64, {
      message: 'Verification token must be 64 hexadecimal characters',
    })
    .regex(/^[a-fA-F0-9]+$/, {
      message: 'Verification token must be hexadecimal',
    }),
  type: z.enum(VerificationType),
});

export type VerifyTokenDto = z.infer<typeof verifyTokenSchema>;
