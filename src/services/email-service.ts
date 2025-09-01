import { sendEmail } from '@/repository/email';
import { generateOtpEmailTemplate } from '@/templates/otp-template';

export class EmailService {
  /**
   * Send OTP email for password reset
   */
  static async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    const subject = 'Password Reset OTP';
    const html = generateOtpEmailTemplate(otp);

    return sendEmail(email, subject, html);
  }
  static async sendCustomEmail(
    email: string,
    subject: string,
    html: string
  ): Promise<boolean> {
    return sendEmail(email, subject, html);
  }
}
