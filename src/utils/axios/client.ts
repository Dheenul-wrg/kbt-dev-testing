import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

// Create axios instance
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
client.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request');
    }
    return Promise.reject(error);
  }
);

// Export functions instead of class
export async function get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await client.get(url, config);
  return response.data;
}

export async function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await client.post(url, data, config);
  return response.data;
}

export async function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await client.put(url, data, config);
  return response.data;
}

export async function del<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await client.delete(url, config);
  return response.data;
}

export async function patch<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await client.patch(url, data, config);
  return response.data;
}

// Export types
export type { AxiosRequestConfig, AxiosResponse };
