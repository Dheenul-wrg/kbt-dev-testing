import { post } from '@/utils/axios/client';
import { AxiosError } from 'axios';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '@/utils/validation';
import {
  ApiResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordResponseData,
  ResetPasswordResponseData,
  LoginResponseData,
  RegisterResponseData,
} from '@/types/api';

// Forgot Password
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ApiResponse<ForgotPasswordResponseData>> {
  // Validate email before making API call
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      message: emailValidation.error || 'Invalid email address',
    };
  }

  try {
    return await post<ApiResponse<ForgotPasswordResponseData>>(
      '/api/auth/forgot-password',
      data
    );
  } catch (error: unknown) {
    // Check if it's an API error response (like 400 with error message)
    if (error instanceof AxiosError && error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send reset email';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Verify OTP
export async function verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse> {
  // Validate OTP before making API call
  if (!data.otp || data.otp.trim().length === 0) {
    return {
      success: false,
      message: 'OTP is required',
    };
  }

  if (data.otp.trim().length < 4) {
    return {
      success: false,
      message: 'OTP must be at least 4 characters long',
    };
  }
  try {
    return await post<ApiResponse>('/api/auth/verify-otp', data);
  } catch (error: unknown) {
    // Check if it's an API error response (like 400 with error message)
    if (error instanceof AxiosError && error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : 'OTP verification failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Reset Password
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ApiResponse<ResetPasswordResponseData>> {
  // Validate password before making API call
  const passwordValidation = validatePassword(data.newPassword);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      message: passwordValidation.error || 'Invalid password',
    };
  }

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      message: emailValidation.error || 'Invalid email address',
    };
  }

  // Validate resetToken
  if (!data.resetToken || data.resetToken.trim().length === 0) {
    return {
      success: false,
      message: 'Reset token is required',
    };
  }

  try {
    return await post<ApiResponse<ResetPasswordResponseData>>(
      '/api/auth/reset-password',
      data
    );
  } catch (error: unknown) {
    // Check if it's an API error response (like 400 with error message)
    if (error instanceof AxiosError && error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Password reset failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Login
export async function login(
  data: LoginRequest
): Promise<ApiResponse<LoginResponseData>> {
  // Validate email before making API call
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      message: emailValidation.error || 'Invalid email address',
    };
  }

  // Validate password
  if (!data.password || data.password.trim().length === 0) {
    return {
      success: false,
      message: 'Password is required',
    };
  }

  try {
    return await post<ApiResponse<LoginResponseData>>('/api/auth/login', data);
  } catch (error: unknown) {
    // Check if it's an API error response (like 400 with error message)
    if (error instanceof AxiosError && error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Login failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Register
export async function register(
  data: RegisterRequest
): Promise<ApiResponse<RegisterResponseData>> {
  // Validate email before making API call
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    return {
      success: false,
      message: emailValidation.error || 'Invalid email address',
    };
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      message: passwordValidation.error || 'Invalid password',
    };
  }

  // Validate firstName
  const firstNameValidation = validateName(data.firstName);
  if (!firstNameValidation.isValid) {
    return {
      success: false,
      message: firstNameValidation.error || 'Invalid first name',
    };
  }

  // Validate lastName
  const lastNameValidation = validateName(data.lastName);
  if (!lastNameValidation.isValid) {
    return {
      success: false,
      message: lastNameValidation.error || 'Invalid last name',
    };
  }

  try {
    return await post<ApiResponse<RegisterResponseData>>(
      '/api/auth/register',
      data
    );
  } catch (error: unknown) {
    // Check if it's an API error response (like 400 with error message)
    if (error instanceof AxiosError && error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Registration failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
