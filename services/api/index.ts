'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { BASE_URL } from './helper';

export interface FetchResult<T> {
  success: boolean;
  data: T;
  message: string;
}

export async function fetchData<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    params?: any;
    baseUrl?: string;
    headers?: any;
  } = {}
): Promise<FetchResult<T>> {
  try {
    const { method = 'GET', data, params, baseUrl, headers } = options;

    const res = await axios({
      url: `${baseUrl || BASE_URL}${endpoint}`,
      method,
      data,
      params,
      headers: {
        ...headers,
        Cookie: cookies().toString(),
      },
    });

    return {
      success: true,
      message: res.data.message || 'Request successful',
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Request failed',
      data: [] as T,
    };
  }
}
