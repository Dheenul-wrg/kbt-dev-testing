'use client';

import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';
import { makeClient } from '@/utils/apollo';

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
