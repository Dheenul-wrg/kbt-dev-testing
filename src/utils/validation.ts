type TranslationFunction = (
  key: string,
  values?: Record<string, string | number>
) => string;

// Regex patterns compiled once at module load
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validatePassword = (
  password: string,
  t?: TranslationFunction
): { isValid: boolean; error?: string } => {
  if (!password) {
    return {
      isValid: false,
      error: t ? t('validation.required') : 'This field is required',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: t
        ? t('form.minPasswordLength', { min: 8 })
        : 'Password must be at least 8 characters long',
    };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return {
      isValid: false,
      error: t
        ? t('validation.strongPassword')
        : 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character',
    };
  }

  return { isValid: true };
};

export const validateEmail = (
  email: string,
  t?: TranslationFunction
): { isValid: boolean; error?: string } => {
  if (!email) {
    return {
      isValid: false,
      error: t ? t('validation.required') : 'This field is required',
    };
  }

  if (!EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      error: t ? t('validation.email') : 'Please enter a valid email address',
    };
  }

  return { isValid: true };
};

export const validateName = (
  name: string,
  t?: TranslationFunction
): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: t ? t('validation.required') : 'This field is required',
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: t
        ? t('validation.minLength', { min: 2 })
        : 'Name must be at least 2 characters long',
    };
  }

  return { isValid: true };
};
