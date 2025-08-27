import { Connection } from 'mongoose';
import bcrypt from 'bcryptjs';
import { getUserModel } from '@/models/User';
import { OTPManager } from './otp-manager';
import { AuthEmailService } from './email-service';
import { ServiceResult } from '..';
import { OrganizationUserRole } from '@/types/system/organization';

export class AuthService {
  /**
   * Send OTP for authentication
   */
  static async sendOTP(
    conn: Connection,
    email: string,
    type: 'register' | 'reset-password' | 'verify-email',
    subdomain: string
  ): Promise<ServiceResult<{ email: string }>> {
    try {
      // Check if user exists for reset-password
      if (type === 'reset-password') {
        const User = getUserModel(conn);
        const user = await User.findOne({ email });
        if (!user) {
          return {
            success: false,
            message: 'User not found',
          };
        }
      }

      // Check if user already exists for register
      if (type === 'register') {
        const User = getUserModel(conn);
        const user = await User.findOne({ email });
        if (user) {
          return {
            success: false,
            message: 'User already exists',
          };
        }
      }

      // Generate and store OTP
      const otp = OTPManager.generateOTP();
      const storeResult = await OTPManager.storeOTP(conn, email, otp, type);

      if (!storeResult.success) {
        return {
          success: false,
          message: storeResult.message,
        };
      }

      // Send OTP email
      Promise.all([AuthEmailService.sendOTPEmail(email, otp, type, subdomain)]);

      return {
        success: true,
        data: { email },
        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  /**
   * Verify OTP and generate token
   */
  static async verifyOTP(
    conn: Connection,
    email: string,
    otp: string,
    type: 'register' | 'reset-password' | 'verify-email'
  ): Promise<ServiceResult<{ token: string; email: string; type: string }>> {
    try {
      // Verify OTP
      const verifyResult = await OTPManager.verifyOTP(conn, email, otp, type);

      if (!verifyResult.success) {
        return {
          success: false,
          message: verifyResult.message,
        };
      }

      // Generate verification token
      const token = OTPManager.createOTPToken(email, otp, type);

      return {
        success: true,
        data: { token, email, type },
        message: 'OTP verified successfully',
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  /**
   * Register new user
   */
  static async registerUser({
    conn,
    name,
    email,
    password,
    subdomain,
    token,
    otp,
  }: {
    conn: Connection;
    name: string;
    email: string;
    password: string;
    subdomain: string;
    token?: string;
    otp?: string;
  }): Promise<
    ServiceResult<{
      email: string;
      name: string;
      role: OrganizationUserRole;
      uid: string;
      organization: string;
    }>
  > {
    try {
      // Check if user already exists
      const User = getUserModel(conn);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
        };
      }

      // Validate authentication method
      if (token) {
        // Token-based registration
        const decodedToken = OTPManager.verifyOTPToken(token);
        if (!decodedToken) {
          return {
            success: false,
            message: 'Invalid or expired token',
          };
        }
        if (decodedToken.email !== email || decodedToken.type !== 'register') {
          return {
            success: false,
            message: 'Invalid token',
          };
        }
      } else if (otp) {
        // OTP-based registration
        const verification = await OTPManager.verifyOTP(conn, email, otp, 'register');
        if (!verification.success) {
          return {
            success: false,
            message: verification.message || 'Invalid OTP',
          };
        }
      } else {
        return {
          success: false,
          message: 'Either token or OTP is required',
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        organization: subdomain,
      });

      // Send welcome email
      Promise.all([AuthEmailService.sendWelcomeEmail(email, user.name || email, subdomain)]);

      // Return user data (excluding password)
      const userResponse = {
        email: user.email,
        name: user.name,
        role: user.role,
        uid: user.uid,
        organization: user.organization,
      };

      return {
        success: true,
        data: userResponse,
        message: 'Registration successful',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      };
    }
  }

  /**
   * Reset user password
   */
  static async resetPassword({
    conn,
    email,
    password,
    token,
    otp,
    subdomain,
  }: {
    conn: Connection;
    email: string;
    password: string;
    token?: string;
    otp?: string;
    subdomain: string;
  }): Promise<ServiceResult> {
    try {
      // Check if user exists
      const User = getUserModel(conn);
      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Validate authentication method
      if (token) {
        // Token-based password reset
        const decodedToken = OTPManager.verifyOTPToken(token);
        if (!decodedToken) {
          return {
            success: false,
            message: 'Invalid or expired token',
          };
        }
        if (decodedToken.email !== email || decodedToken.type !== 'reset-password') {
          return {
            success: false,
            message: 'Invalid token',
          };
        }
      } else if (otp) {
        // OTP-based password reset
        const verification = await OTPManager.verifyOTP(conn, email, otp, 'reset-password');
        if (!verification.success) {
          return {
            success: false,
            message: verification.message || 'Invalid OTP',
          };
        }
      } else {
        return {
          success: false,
          message: 'Either token or OTP is required',
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password
      await User.updateOne({ email }, { $set: { password: hashedPassword } });

      // Send password reset confirmation email
      Promise.all([AuthEmailService.sendPasswordResetConfirmation(email, subdomain)]);

      return {
        success: true,
        data: { email },
        message: 'Password reset successfully',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  /**
   * Clean up expired OTPs
   */
  static async cleanupExpiredOTPs(conn: Connection, email: string): Promise<void> {
    await OTPManager.cleanupExpiredOTPs(conn, email);
  }
}
