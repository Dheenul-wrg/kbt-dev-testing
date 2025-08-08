// Export all TypeScript types from this directory
// Example: export type { User } from './user';
// Example: export type { Trip } from './trip';

// Common types
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
