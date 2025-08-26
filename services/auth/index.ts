// Core authentication services
export { OTPManager } from './otp-manager';
export { AuthService } from './auth-service';
export { AuthEmailService } from './email-service';

// Validation utilities
export {
  emailSchema,
  otpSchema,
  registrationSchema,
  sendOTPSchema,
  verifyOTPSchema,
  resetPasswordSchema,
  loginSchema,
  validateRequest,
  type EmailRequest,
  type OTPRequest,
  type RegistrationRequest,
  type SendOTPRequest,
  type VerifyOTPRequest,
  type ResetPasswordRequest,
  type LoginRequest,
} from './validation';

// Types
export type { OTPTokenPayload } from './otp-manager';
export type { AuthResult } from './auth-service';
