import { getClient } from './apollo-client';
import type { DocumentNode } from 'graphql';

export async function executeQuery<T = unknown>(
  query: DocumentNode,
  variables?: Record<string, unknown>
): Promise<T> {
  const client = getClient();

  try {
    const result = await client.query({
      query,
      variables,
      fetchPolicy: 'network-only',
    });

    return result.data as T;
  } catch (error) {
    console.error('GraphQL query error:', error);
    throw error;
  }
}
