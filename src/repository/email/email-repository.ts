import { createEmailTransporter, getDefaultFromEmail } from '@/utils/email';

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    const transporter = createEmailTransporter();
    const fromEmail = getDefaultFromEmail();

    const mailOptions = {
      from: fromEmail,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to send email to ${to}: ${error.message}`);
    } else {
      throw new Error(`Failed to send email to ${to}: Unknown error occurred`);
    }
  }
}
