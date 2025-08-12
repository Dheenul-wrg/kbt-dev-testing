// Common messages
export const COMMON_MESSAGES = {
  LOADING: 'Loading...',
  ERROR: 'An error occurred',
} as const;

// Form messages
export const FORM_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_PASSWORD_LENGTH: 'Password must be at least 6 characters long',
  ALL_FIELDS_REQUIRED: 'All fields are required',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  SERVER_ERROR: 'Internal server error',
  NOT_IMPLEMENTED: 'Not implemented yet',
  AUTHENTICATION_NOT_IMPLEMENTED: 'Authentication not implemented yet',
  REGISTRATION_NOT_IMPLEMENTED: 'Registration not implemented yet',
  EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
  INVALID_EMAIL_FORMAT: 'Invalid email format',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created',
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
} as const;

// Apollo/GraphQL messages
export const APOLLO_MESSAGES = {
  QUERY_ERROR: 'GraphQL query error',
  MUTATION_ERROR: 'GraphQL mutation error',
} as const;

// Legacy export for backward compatibility (if needed)
export const messages = {
  common: COMMON_MESSAGES,
  form: FORM_MESSAGES,
  errors: ERROR_MESSAGES,
  success: SUCCESS_MESSAGES,
  apollo: APOLLO_MESSAGES,
};
