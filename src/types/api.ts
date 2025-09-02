// Base API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  resetToken?: string; // For APIs that return resetToken at root level
}

// Auth-related request interfaces
export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Auth-related response data interfaces
export interface ForgotPasswordResponseData {
  message: string;
}

export interface ResetPasswordResponseData {
  message: string;
}

export interface LoginResponseData {
  message: string;
  token?: string;
}

export interface RegisterResponseData {
  message: string;
  user?: {
    id: number;
    email: string;
  };
}
