import { z } from 'zod';

// Email validation schema
export const emailSchema = z.object({
  email: z.email('Invalid email format'),
});

// OTP validation schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

// Registration validation schema
export const registrationSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  token: z.string().min(1, 'Token is required'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

// Send OTP validation schema
export const sendOTPSchema = z.object({
  email: z.email('Invalid email format'),
  type: z.enum(['register', 'reset-password', 'verify-email']).default('register'),
});

// Verify OTP validation schema
export const verifyOTPSchema = z.object({
  email: z.email('Invalid email format'),
  otp: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .refine((val) => val.length === 6, 'OTP must be 6 digits')
    .refine((val) => /^\d{6}$/.test(val), 'OTP must contain only digits'),
  type: z.enum(['register', 'reset-password', 'verify-email']),
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  token: z.string().min(1, 'Token is required'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type EmailRequest = z.infer<typeof emailSchema>;
export type OTPRequest = z.infer<typeof otpSchema>;
export type RegistrationRequest = z.infer<typeof registrationSchema>;
export type SendOTPRequest = z.infer<typeof sendOTPSchema>;
export type VerifyOTPRequest = z.infer<typeof verifyOTPSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
