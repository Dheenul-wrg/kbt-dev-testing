import { messages } from '@/locales/en/messages';

export type LocaleKey = keyof typeof messages;

export function getMessage(
  path: string,
  params?: Record<string, string | number>
): string {
  const keys = path.split('.');
  let value: unknown = messages;

  for (const key of keys) {
    if (typeof value === 'object' && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
    if (!value) return path;
  }

  if (typeof value !== 'string') return path;

  if (!params) return value;

  return Object.entries(params).reduce(
    (msg, [key, val]) => msg.replace(new RegExp(`{${key}}`, 'g'), String(val)),
    value
  );
}

// Convenience functions for common message types
export const locale = {
  common: (
    key: keyof typeof messages.common,
    params?: Record<string, string | number>
  ) => getMessage(`common.${key}`, params),

  form: (
    key: keyof typeof messages.form,
    params?: Record<string, string | number>
  ) => getMessage(`form.${key}`, params),

  errors: (
    key: keyof typeof messages.errors,
    params?: Record<string, string | number>
  ) => getMessage(`errors.${key}`, params),

  success: (
    key: keyof typeof messages.success,
    params?: Record<string, string | number>
  ) => getMessage(`success.${key}`, params),

  apollo: (
    key: keyof typeof messages.apollo,
    params?: Record<string, string | number>
  ) => getMessage(`apollo.${key}`, params),
};
