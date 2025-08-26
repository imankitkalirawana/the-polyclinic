import { sendHTMLEmail } from '@/lib/server-actions/email';
import { OtpEmail } from '@/templates/email';
import { toTitleCase } from '@/lib/utils';
import { OTPTokenPayload } from './otp-manager';

export class AuthEmailService {
  /**
   * Send OTP email for authentication
   */
  static async sendOTPEmail(
    email: string,
    otp: string,
    type: OTPTokenPayload['type'],
    subdomain: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const subject = this.getEmailSubject(type, subdomain);

      await sendHTMLEmail({
        to: email,
        subject,
        html: OtpEmail({ otp, type }),
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return {
        success: false,
        message: 'Failed to send OTP email',
      };
    }
  }

  /**
   * Get appropriate email subject based on type
   */
  private static getEmailSubject(type: OTPTokenPayload['type'], subdomain: string): string {
    const organizationName = toTitleCase(subdomain);

    switch (type) {
      case 'register':
        return `${organizationName} - Account Verification`;
      case 'reset-password':
        return `${organizationName} - Password Reset`;
      case 'verify-email':
        return `${organizationName} - Email Verification`;
      default:
        return `${organizationName} - Verification Code`;
    }
  }

  /**
   * Send welcome email after successful registration
   */
  static async sendWelcomeEmail(
    email: string,
    name: string,
    subdomain: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const organizationName = toTitleCase(subdomain);

      await sendHTMLEmail({
        to: email,
        subject: `Welcome to ${organizationName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to ${organizationName}!</h2>
            <p>Hello ${name},</p>
            <p>Your account has been successfully created. You can now log in to access your account.</p>
            <p>Thank you for choosing ${organizationName}!</p>
          </div>
        `,
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return {
        success: false,
        message: 'Failed to send welcome email',
      };
    }
  }

  /**
   * Send password reset confirmation email
   */
  static async sendPasswordResetConfirmation(
    email: string,
    subdomain: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const organizationName = toTitleCase(subdomain);

      await sendHTMLEmail({
        to: email,
        subject: `${organizationName} - Password Reset Successful`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Successful</h2>
            <p>Your password has been successfully reset.</p>
            <p>If you did not request this change, please contact support immediately.</p>
            <p>Thank you,<br>${organizationName} Team</p>
          </div>
        `,
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending password reset confirmation:', error);
      return {
        success: false,
        message: 'Failed to send password reset confirmation',
      };
    }
  }
}
