// Application constants
export const APP_NAME = 'KBT Trip Builder';
export const APP_VERSION = '1.0.0';

// API endpoints
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

// Common strings
export const COMMON_STRINGS = {
  LOADING: 'Loading...',
  ERROR: 'An error occurred',
  SUCCESS: 'Success!',
} as const;
