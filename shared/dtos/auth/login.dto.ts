import { z } from 'zod';
import { emailValidation, passwordValidation } from '../factory.dto';

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type LoginDto = z.infer<typeof loginSchema>;
