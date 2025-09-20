import { AxiosRequestConfig } from 'axios';
import { AxiosResponse } from 'axios';
import clientAxios from './client';
import serverAxios from './server';

const axiosInstance = typeof window !== 'undefined' ? clientAxios : serverAxios;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export async function apiRequest<TData = unknown, TRequest = unknown>(
  config: AxiosRequestConfig<TRequest>
): Promise<ApiResponse<TData>> {
  const response: AxiosResponse<ApiResponse<TData>> = await axiosInstance.request<
    ApiResponse<TData>,
    AxiosResponse<ApiResponse<TData>>,
    TRequest
  >(config);
  return response.data;
}
