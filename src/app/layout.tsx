import { ApolloWrapper, AuthSessionProvider } from '@/components/providers';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KBT Trip Builder',
  description: 'A modern trip building application',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get messages for default locale (English)
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={'font-gt-america'}>
        <NextIntlClientProvider>
          <ApolloWrapper>
            <AuthSessionProvider>{children}</AuthSessionProvider>
          </ApolloWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
