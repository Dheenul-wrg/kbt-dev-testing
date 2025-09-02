// Add this to the end of src/constants/index.ts

// Rate limiting configuration constants
export const RATE_LIMIT_CONFIG = {
  AUTH_WINDOW: 5 * 60 * 1000,
  API_WINDOW: 15 * 60 * 1000,
  AUTH_MAX_REQUESTS: 50,
  API_MAX_REQUESTS: 100,
};
