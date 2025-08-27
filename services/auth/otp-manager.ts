import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { getVerificationModel } from '@/models/Verification';
import { Connection } from 'mongoose';

export interface OTPTokenPayload extends JwtPayload {
  email: string;
  otp: string;
  type: 'register' | 'reset-password' | 'verify-email';
  purpose: 'verification';
}

export class OTPManager {
  private static readonly OTP_LENGTH = 6;
  private static readonly TOKEN_EXPIRY = '10m'; // 10 minutes
  private static readonly MAX_ATTEMPTS = 3;

  /**
   * Generate a secure OTP
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create a JWT token for OTP verification
   */
  static createOTPToken(email: string, otp: string, type: OTPTokenPayload['type']): string {
    const payload: OTPTokenPayload = {
      email,
      otp,
      type,
      purpose: 'verification',
      iat: Math.floor(Date.now() / 1000),
    };

    return sign(payload, process.env.NEXTAUTH_SECRET!, { expiresIn: this.TOKEN_EXPIRY });
  }

  /**
   * Verify and decode OTP token
   */
  static verifyOTPToken(token: string): OTPTokenPayload | null {
    try {
      const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as OTPTokenPayload;

      if (decoded.purpose !== 'verification') {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Store OTP in database with attempt tracking
   */
  static async storeOTP(
    conn: Connection,
    email: string,
    otp: string,
    type: OTPTokenPayload['type']
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const Verification = getVerificationModel(conn);

      const existingVerification = await Verification.findOne({ email, type });

      if (existingVerification) {
        if (existingVerification.count >= this.MAX_ATTEMPTS) {
          return {
            success: false,
            message: 'Maximum OTP attempts reached. Please try again later.',
          };
        }

        await Verification.updateOne({ email, type }, { $set: { otp }, $inc: { count: 1 } });
      } else {
        await Verification.create({
          email,
          type,
          otp,
          count: 1,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error storing OTP:', error);
      return {
        success: false,
        message: 'Failed to store OTP',
      };
    }
  }

  /**
   * Verify OTP from database
   */
  static async verifyOTP(
    conn: Connection,
    email: string,
    otp: string,
    type: OTPTokenPayload['type']
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const Verification = getVerificationModel(conn);

      const verification = await Verification.findOne({ email, type, otp });

      if (!verification) {
        return {
          success: false,
          message: 'Invalid OTP',
        };
      }

      await Verification.deleteOne({ email, type });

      return { success: true };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP',
      };
    }
  }

  /**
   * Clean up expired OTPs (can be called periodically)
   */
  static async cleanupExpiredOTPs(conn: Connection, email: string): Promise<void> {
    try {
      const Verification = getVerificationModel(conn);

      await Verification.deleteMany({
        email,
      });
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
    }
  }
}
