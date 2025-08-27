import { z } from 'zod';

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
    token: z.string().optional(),
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
  type: z.enum(['register', 'reset-password', 'verify-email']).default('register'),
  subdomain: z.string().optional().nullable(),
});

// Verify OTP validation schema
export const verifyOTPSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  otp: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .refine((val) => val.length === 6, { error: 'OTP must be 6 digits' })
    .refine((val) => /^\d{6}$/.test(val), { error: 'OTP must contain only digits' }),
  type: z.enum(['register', 'reset-password', 'verify-email']),
  subdomain: z.string().optional().nullable(),
});

// Reset password validation schema
export const resetPasswordSchema = z
  .object({
    email: z.email({ error: 'Invalid email format' }),
    password: z.string().min(8, { error: 'Password must be at least 8 characters' }),
    token: z.jwt({ message: 'Invalid token' }).optional(),
    otp: z
      .string()
      .length(6, { error: 'OTP must be 6 digits' })
      .regex(/^\d{6}$/, { error: 'OTP must contain only digits' })
      .optional(),
    subdomain: z.string().optional().nullable(),
  })
  .refine((data) => data.token || data.otp, { error: 'Either token or OTP is required' });

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
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
