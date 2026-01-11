import { z } from 'zod';
import { OtpType } from './auth.constants';

// Email validation schema
export const emailSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
});

// OTP validation schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { error: 'OTP must be 6 digits' })
    .regex(/^\d{6}$/, { error: 'OTP must contain only digits' }),
});

// Registration validation schema
export const registrationSchema = z
  .object({
    name: z.string({ error: 'Name is required' }).min(1, { error: 'Name cannot be empty' }),
    email: z.email({ error: 'Invalid email format' }),
    password: z.string().min(8, { error: 'Password must be at least 8 characters' }),
    subdomain: z.string().min(1, { error: 'Organization/subdomain is required for registration' }),
    token: z.jwt({ message: 'Invalid token' }).optional(),
    otp: z
      .string()
      .length(6, { error: 'OTP must be 6 digits' })
      .regex(/^\d{6}$/, { error: 'OTP must contain only digits' })
      .optional(),
  })
  .refine((data) => data.token || data.otp, { message: 'Either token or OTP is required' });

// Send OTP validation schema
export const sendOTPSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  type: z.enum(OtpType).default(OtpType.registration),
});

// Verify OTP validation schema
export const verifyOTPSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  code: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .refine((val) => val.length === 6, { error: 'OTP must be 6 digits' })
    .refine((val) => /^\d{6}$/.test(val), { error: 'OTP must contain only digits' }),
  type: z.enum(OtpType).default(OtpType.registration),
});

// Reset password validation schema
export const forgotPasswordSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  password: z.string().min(6, { error: 'Password must be at least 6 characters' }),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  password: z.string().min(1, { error: 'Password is required' }),
});

export type EmailRequest = z.infer<typeof emailSchema>;
export type OTPRequest = z.infer<typeof otpSchema>;
export type RegistrationRequest = z.infer<typeof registrationSchema>;
export type SendOTPRequest = z.infer<typeof sendOTPSchema>;
export type VerifyOTPRequest = z.infer<typeof verifyOTPSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
