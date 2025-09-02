import { post } from '@/utils/axios/client';
import {
  ApiResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  LoginRequest,
  RegisterRequest,
} from '@/types/api';

// Forgot Password
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ApiResponse> {
  try {
    return await post<ApiResponse>('/api/auth/forgot-password', data);
  } catch (error) {
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
  try {
    return await post<ApiResponse>('/api/auth/verify-otp', data);
  } catch (error) {
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
): Promise<ApiResponse> {
  try {
    return await post<ApiResponse>('/api/auth/reset-password', data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Password reset failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Login
export async function login(data: LoginRequest): Promise<ApiResponse> {
  try {
    return await post<ApiResponse>('/api/auth/login', data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Login failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Register
export async function register(data: RegisterRequest): Promise<ApiResponse> {
  try {
    return await post<ApiResponse>('/api/auth/register', data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Registration failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
