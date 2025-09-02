import nodemailer from 'nodemailer';
import type { EmailConfig } from '@/types/email';

// Email client configuration
const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  from: process.env.EMAIL_FROM || 'noreply@example.com',
};

// Create and return email transporter
export function createEmailTransporter(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
  });
}

// Get default from email
export function getDefaultFromEmail(): string {
  return emailConfig.from;
}
