import axios from 'axios';
import { getTranslations } from 'next-intl/server';

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

export function isSlackEnabled(): boolean {
  return !!webhookUrl;
}

/**
 * Simple error alert to Slack
 */
export async function sendErrorAlert(
  error: Error | string,
  context?: {
    user?: string;
    action?: string;
    url?: string;
  }
): Promise<boolean> {
  if (!isSlackEnabled()) return false;

  try {
    const t = await getTranslations();
    const errorMessage =
      typeof error === 'string'
        ? error
        : error.message || t('slack.unknownError');

    const fields = [
      { title: t('slack.fields.error'), value: errorMessage, short: false },
      ...(context?.user
        ? [{ title: t('slack.fields.user'), value: context.user, short: true }]
        : []),
      ...(context?.action
        ? [
            {
              title: t('slack.fields.action'),
              value: context.action,
              short: true,
            },
          ]
        : []),
      ...(context?.url
        ? [{ title: t('slack.fields.url'), value: context.url, short: true }]
        : []),
    ];

    const response = await axios.post(webhookUrl!, {
      text: `🚨 *${t('slack.titles.error')}*`,
      attachments: [{ color: '#ff0000', fields }],
      username: t('slack.username'),
      icon_emoji: t('slack.iconEmoji'),
    });

    return response.status === 200;
  } catch (error) {
    console.error('Slack error:', error);
    return false;
  }
}
