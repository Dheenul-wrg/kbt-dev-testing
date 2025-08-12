import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Default to English if no locale provided
  const currentLocale = locale || 'en';

  return {
    locale: currentLocale,
    messages: (await import(`../locales/${currentLocale}.json`)).default,
  };
});
