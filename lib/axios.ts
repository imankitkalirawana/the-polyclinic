// lib/axios.ts
import axios, { AxiosRequestConfig } from 'axios';
import { addToast } from '@heroui/react'; // Assuming addToast is available

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
  successMessage?: string; // Optional success message
  errorMessage?: string; // Optional error message
  onSuccess?: (responseData: any) => void; // Optional success callback
  onError?: (error: any) => void; // Optional error callback
  isToast?: boolean; // Optional toast
}

export const apiRequest = async ({
  method,
  url,
  data,
  headers,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
  isToast = true,
}: ApiOptions) => {
  try {
    // Send the API request
    const response = await axios({
      method,
      url,
      data,
      headers,
    });

    // Handle success response
    if (isToast) {
      addToast({
        title: 'Success',
        description: successMessage || response.data.message || 'Success',
        color: 'success',
      });
    }

    // If onSuccess is provided, call it with the response data
    if (onSuccess) {
      onSuccess(response.data);
    }

    return response.data;
  } catch (error: any) {
    console.error('API Request failed', error);

    // Handle error response
    if (isToast) {
      addToast({
        title: 'Error',
        description:
          errorMessage ||
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
