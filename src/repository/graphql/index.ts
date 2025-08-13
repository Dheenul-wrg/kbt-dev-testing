import type { DocumentNode } from 'graphql';
import { getTranslations } from 'next-intl/server';
import { getClient } from '@/utils/apollo/apollo-server';

/**
 * Execute GraphQL query on server-side
 */
export async function executeQuery<T = unknown>(
  query: DocumentNode,
  variables?: Record<string, unknown>
): Promise<T> {
  const client = getClient();
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
