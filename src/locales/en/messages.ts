export const messages = {
  // Common messages (currently used)
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
  },

  // Form messages (from your auth routes)
  form: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    minPasswordLength: 'Password must be at least 6 characters long',
    allFieldsRequired: 'All fields are required',
  },

  // Error messages (from your API routes)
  errors: {
    serverError: 'Internal server error',
    notImplemented: 'Not implemented yet',
    authenticationNotImplemented: 'Authentication not implemented yet',
    registrationNotImplemented: 'Registration not implemented yet',
    emailPasswordRequired: 'Email and password are required',
    invalidEmailFormat: 'Invalid email format',
  },

  // Success messages (basic ones)
  success: {
    created: 'Successfully created',
    updated: 'Successfully updated',
    deleted: 'Successfully deleted',
  },

  // Apollo/GraphQL messages (from your server-client.ts)
  apollo: {
    queryError: 'GraphQL query error',
    mutationError: 'GraphQL mutation error',
  },
};
