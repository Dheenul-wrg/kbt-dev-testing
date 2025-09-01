export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface EmailProvider {
  sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}
