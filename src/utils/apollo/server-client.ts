import { getClient } from './apollo-server'; // Use server version
import type { DocumentNode } from 'graphql';
import { getTranslations } from 'next-intl/server';

/**
 * Utility function for server-side GraphQL queries
 * Use this in Server Components or API routes
 */
export async function executeQuery<T = unknown>(
  query: DocumentNode,
  variables?: Record<string, unknown>
): Promise<T> {
  const client = getClient(); // This uses registerApolloClient
  const t = await getTranslations();

  try {
    const result = await client.query({
      query,
      variables,
      fetchPolicy: 'network-only',
    });

    return result.data as T;
  } catch (error) {
    console.error(t('apollo.queryError'), error);
    throw new Error(t('apollo.queryError'));
  }
}
