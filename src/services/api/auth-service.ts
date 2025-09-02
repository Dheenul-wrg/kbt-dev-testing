import { post } from '@/utils/axios/client';
import {
  ApiResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordResponseData,
  VerifyOtpResponseData,
  ResetPasswordResponseData,
  LoginResponseData,
  RegisterResponseData,
} from '@/types/api';

// Forgot Password
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ApiResponse<ForgotPasswordResponseData>> {
  try {
    return await post<ApiResponse<ForgotPasswordResponseData>>(
      '/api/auth/forgot-password',
      data
    );
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
export async function verifyOtp(
  data: VerifyOtpRequest
): Promise<ApiResponse<VerifyOtpResponseData>> {
  try {
    return await post<ApiResponse<VerifyOtpResponseData>>(
      '/api/auth/verify-otp',
      data
    );
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
): Promise<ApiResponse<ResetPasswordResponseData>> {
  try {
    return await post<ApiResponse<ResetPasswordResponseData>>(
      '/api/auth/reset-password',
      data
    );
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
export async function login(
  data: LoginRequest
): Promise<ApiResponse<LoginResponseData>> {
  try {
    return await post<ApiResponse<LoginResponseData>>('/api/auth/login', data);
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
export async function register(
  data: RegisterRequest
): Promise<ApiResponse<RegisterResponseData>> {
  try {
    return await post<ApiResponse<RegisterResponseData>>(
      '/api/auth/register',
      data
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Registration failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
