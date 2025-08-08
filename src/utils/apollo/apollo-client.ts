import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Create a generic Apollo Client for any GraphQL API
export const createApolloClient = (
  uri: string,
  headers?: Record<string, string>
) => {
  const httpLink = createHttpLink({
    uri,
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        console.error(`[GraphQL error]: ${message}`);
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  const authLink = setContext((_, { headers: contextHeaders }) => {
    const authHeaders: Record<string, string> = {
      ...contextHeaders,
      'Content-Type': 'application/json',
      ...headers,
    };

    return { headers: authHeaders };
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add custom field policies as needed
        },
      },
    },
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  });
};

// Default Apollo Client instance (configure with your GraphQL endpoint)
export const apolloClient = createApolloClient(
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'
);
