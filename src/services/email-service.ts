import { sendEmail } from '@/repository/email';
import { generateOtpEmailTemplate } from '@/templates/otp-template';

export class EmailService {
  /**
   * Send OTP email for password reset
   * @throws {Error} When email sending fails
   */
  static async sendOtpEmail(email: string, otp: string): Promise<void> {
    const subject = 'Password Reset OTP';
    const html = generateOtpEmailTemplate(otp);

    await sendEmail(email, subject, html);
  }

  /**
   * Send custom email
   * @throws {Error} When email sending fails
   */
  static async sendCustomEmail(
    email: string,
    subject: string,
    html: string
  ): Promise<void> {
    await sendEmail(email, subject, html);
  }
}
