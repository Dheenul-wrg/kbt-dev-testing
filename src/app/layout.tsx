import { ApolloWrapper, AuthSessionProvider } from '@/components/providers';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import './globals.css';

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

  // Fetch session on server to prevent UI flickering
  const session = await getServerSession(authOptions);

  return (
    <html lang={locale}>
      <body className="font-gt-america antialiased">
        <NextIntlClientProvider>
            <AuthSessionProvider session={session}>
          <ApolloWrapper>
              {children}
          </ApolloWrapper>
            </AuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
