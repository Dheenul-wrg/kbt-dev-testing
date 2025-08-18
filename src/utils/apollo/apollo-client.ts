import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';

export function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
      fetchOptions: {
        // Add Next.js fetch options here if needed
      },
    }),
  });
}
