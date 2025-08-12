import { messages } from '@/locales/en/messages';

export type LocaleKey = keyof typeof messages;

// Helper function to get nested message
export function getMessage(path: string): string {
  const keys = path.split('.');
  let value: unknown = messages;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  if (typeof value !== 'string') {
    return path;
  }

  return value;
}

// Convenience functions for common message types
export const locale = {
  common: (key: keyof typeof messages.common) => getMessage(`common.${key}`),

  form: (key: keyof typeof messages.form) => getMessage(`form.${key}`),

  errors: (key: keyof typeof messages.errors) => getMessage(`errors.${key}`),

  success: (key: keyof typeof messages.success) => getMessage(`success.${key}`),

  apollo: (key: keyof typeof messages.apollo) => getMessage(`apollo.${key}`),
};
