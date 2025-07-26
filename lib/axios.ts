// lib/axios.ts
import { addToast } from '@heroui/react'; // Assuming addToast is available
import axios, { AxiosRequestConfig } from 'axios';

import type { $FixMe } from '@/types';

export const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

interface ApiOptions {
  method: AxiosRequestConfig['method']; // Define your methods
  url: string;
  data?: AxiosRequestConfig['data']; // Request payload
  headers?: AxiosRequestConfig['headers']; // Optional headers
  responseType?: AxiosRequestConfig['responseType']; // Optional response type
  successMessage?: {
    title?: string;
    description?: string;
  }; // Optional success message
  errorMessage?: {
    title?: string;
    description?: string;
  }; // Optional error message
  onSuccess?: (responseData: $FixMe) => void; // Optional success callback
  onError?: (error: $FixMe) => void; // Optional error callback
  showToast?: boolean; // Optional toast
}

export const apiRequest = async ({
  method,
  url,
  data,
  headers,
  responseType,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
  showToast = false,
}: ApiOptions) => {
  try {
    // Send the API request
    const response = await axios({
      method,
      url,
      data,
      headers,
      responseType,
    });

    // Handle success response
    if (showToast) {
      addToast({
        title: successMessage?.title || null,
        description: successMessage?.description || response.data.message || null,
        color: 'success',
      });
    }

    // If onSuccess is provided, call it with the response data
    if (onSuccess) {
      onSuccess(response.data);
    }

    return response.data;
  } catch (error: $FixMe) {
    console.error('API Request failed', error);
    // Handle error response
    if (showToast) {
      addToast({
        title: errorMessage?.title || null,
        description:
          errorMessage?.description ||
          error?.response?.data?.message ||
          error?.message ||
          'An unknown error occurred.',
        color: 'danger',
      });
    }

    // If onError is provided, call it with the error
    if (onError) {
      onError(error);
    }
  }
};
