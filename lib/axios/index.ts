import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import clientAxios from './client';
import serverAxios from './server';

const axiosInstance = typeof window !== 'undefined' ? clientAxios : serverAxios;

// Success response structure from API
interface SuccessResponse<T = unknown> {
  data: T;
  message: string;
}

// Error response structure from API
interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  meta?: Record<string, unknown>;
  message: string; // always defined
  errors?: string[];
}

export async function apiRequest<TData = unknown, TRequest = unknown>(
  config: AxiosRequestConfig<TRequest>
): Promise<ApiResponse<TData>> {
  try {
    const response: AxiosResponse<SuccessResponse<TData>> = await axiosInstance.request<
      SuccessResponse<TData>,
      AxiosResponse<SuccessResponse<TData>>,
      TRequest
    >(config);

    return {
      success: true,
      // @ts-ignore TODO: fix this
      data: response.data.data || response.data || null,
      message: response.data.message,
      errors: undefined,
    };
  } catch (error) {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error('Axios error', axiosError);

      const errorData = axiosError.response?.data;
      const errorMessage = errorData?.message ?? 'Something went wrong';
      const errorDetails = errorData?.error;

      return {
        success: false,
        data: null,
        message: errorMessage,
        errors: errorDetails ? [errorDetails] : [],
      };
    }

    console.error('Error', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Something went wrong',
      errors: [],
    };
  }
}
