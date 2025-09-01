import { createEmailTransporter, getDefaultFromEmail } from '@/utils/email';

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
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
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
