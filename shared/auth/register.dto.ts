import { z } from 'zod';
import {
  emailValidation,
  passwordValidation,
  nameValidation,
  phoneNumberValidation,
  otpValidation,
} from '../factory.dto';

export const registerSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
  name: nameValidation,
  phone: phoneNumberValidation,
  otp: otpValidation,
});

export type RegisterDto = z.infer<typeof registerSchema>;
