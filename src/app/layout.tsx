import type React from 'react';
import { ApolloWrapper, AuthSessionProvider } from '@/components/providers';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import './globals.css';
import { ModalManager } from '@/components/modal-manager/modal-manager';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

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
          <NuqsAdapter>
            <AuthSessionProvider session={session}>
              <ApolloWrapper>
                {children}
                <ModalManager />
              </ApolloWrapper>
            </AuthSessionProvider>
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
