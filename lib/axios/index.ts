// eslint-disable-next-line no-restricted-imports
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import clientAxios from './client';
import serverAxios from './server';

const axiosInstance = typeof window !== 'undefined' ? clientAxios : serverAxios;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null; // always defined (but can be null)
  message: string; // always defined
  errors?: string[];
}

export async function apiRequest<TData = unknown, TRequest = unknown>(
  config: AxiosRequestConfig<TRequest>
): Promise<ApiResponse<TData>> {
  try {
    console.log('axios/index.ts: Before request', config);
    const response: AxiosResponse<ApiResponse<TData>> = await axiosInstance.request<
      ApiResponse<TData>,
      AxiosResponse<ApiResponse<TData>>,
      TRequest
    >(config);

    console.log('axios/index.ts: After request', response);

    return {
      success: true,
      data: response.data.data ?? null,
      message: response.data.message,
      errors: response.data.errors,
    };
  } catch (error) {
    console.log('axios/index.ts: After request error', error);
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const axiosError = error as AxiosError<ApiResponse<TData>>;
      console.log('axios/index.ts: After request error with axiosError', axiosError);
      return {
        success: false,
        data: axiosError.response?.data?.data ?? null,
        message: axiosError.response?.data?.message ?? 'Request failed',
        errors: axiosError.response?.data?.errors,
      };
    }
    console.log('axios/index.ts: After request error with error', error);

    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Request failed',
      errors: [],
    };
  }
}
