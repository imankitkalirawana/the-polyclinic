import { Connection } from 'mongoose';
import bcrypt from 'bcryptjs';
import { getUserModel } from '@/models/User';
import { OTPManager } from './otp-manager';
import { AuthEmailService } from './email-service';

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export class AuthService {
  /**
   * Send OTP for authentication
   */
  static async sendOTP(
    conn: Connection,
    email: string,
    type: 'register' | 'reset-password' | 'verify-email',
    subdomain: string
  ): Promise<AuthResult> {
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
      const emailResult = await AuthEmailService.sendOTPEmail(email, otp, type, subdomain);

      if (!emailResult.success) {
        return {
          success: false,
          message: emailResult.message,
        };
      }

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
  ): Promise<AuthResult<{ token: string; email: string; type: string }>> {
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
  static async registerUser(
    conn: Connection,
    email: string,
    password: string,
    token: string,
    otp: string,
    subdomain: string
  ): Promise<AuthResult> {
    try {
      // Verify OTP token
      const decodedToken = OTPManager.verifyOTPToken(token);

      if (!decodedToken) {
        return {
          success: false,
          message: 'Invalid or expired token',
        };
      }

      // Validate token data
      if (
        decodedToken.email !== email ||
        decodedToken.type !== 'register' ||
        decodedToken.otp !== otp
      ) {
        return {
          success: false,
          message: 'Invalid token or OTP',
        };
      }

      // Check if user already exists
      const User = getUserModel(conn);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        organization: subdomain,
        role: 'user', // Default role
        uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });

      // Send welcome email
      await AuthEmailService.sendWelcomeEmail(email, user.name || email, subdomain);

      // Return user data (excluding password)
      const userResponse = {
        id: user._id,
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
        message: 'Internal server error',
      };
    }
  }

  /**
   * Reset user password
   */
  static async resetPassword(
    conn: Connection,
    email: string,
    password: string,
    token: string,
    otp: string,
    subdomain: string
  ): Promise<AuthResult> {
    try {
      // Verify OTP token
      const decodedToken = OTPManager.verifyOTPToken(token);

      if (!decodedToken) {
        return {
          success: false,
          message: 'Invalid or expired token',
        };
      }

      // Validate token data
      if (
        decodedToken.email !== email ||
        decodedToken.type !== 'reset-password' ||
        decodedToken.otp !== otp
      ) {
        return {
          success: false,
          message: 'Invalid token or OTP',
        };
      }

      // Check if user exists
      const User = getUserModel(conn);
      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password
      await User.updateOne({ email }, { $set: { password: hashedPassword } });

      // Send password reset confirmation email
      await AuthEmailService.sendPasswordResetConfirmation(email, subdomain);

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
