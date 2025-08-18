import { sendErrorAlert as repoSendErrorAlert } from '@/repository/slack';

/**
 * Send error alert to Slack
 */
export async function sendErrorAlert(
  error: Error | string,
  context?: {
    user?: string;
    action?: string;
    url?: string;
  }
): Promise<boolean> {
  return repoSendErrorAlert(error, context);
}
