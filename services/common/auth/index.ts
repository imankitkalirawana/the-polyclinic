// Core authentication services

// Validation utilities
export {
  emailSchema,
  otpSchema,
  registrationSchema,
  sendOTPSchema,
  verifyOTPSchema,
  resetPasswordSchema,
  loginSchema,
  type EmailRequest,
  type OTPRequest,
  type RegistrationRequest,
  type SendOTPRequest,
  type VerifyOTPRequest,
  type ResetPasswordRequest,
  type LoginRequest,
} from './validation';

// Types
export { validateRequest } from '@/services';
