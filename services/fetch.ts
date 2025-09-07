'use server';
import { cookies } from 'next/headers';
import axios from 'axios';
import type { $FixMe } from '@/types';
import { getSubdomain } from '@/auth/sub-domain';
import { BASE_URL } from './constants';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  limit?: number;
  search?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
    totalPages: number;
  };
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: PaginationResponse<T>;
  message?: string;
  errors?: string[];
}

export async function fetchData<T = unknown>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: $FixMe;
    params?: $FixMe;
    baseUrl?: string;
    headers?: $FixMe;
  } = {}
): Promise<ApiResponse<T>> {
  try {
    const { method = 'GET', data, params, baseUrl, headers } = options;

    let url: string;

    if (baseUrl) {
      // ✅ if baseUrl is provided, use it directly
      url = `${baseUrl}${endpoint}`;
    } else {
      const subdomain = await getSubdomain(); // e.g. "clinic"

      const parsed = new URL(BASE_URL);

      if (subdomain) {
        // ✅ Always prepend subdomain to full hostname
        parsed.hostname = `${subdomain}.${parsed.hostname}`;
      }

      url = `${parsed.origin}${parsed.pathname}${endpoint}`;
    }

    const res = await axios({
      url,
      method,
      data,
      params,
      headers: {
        ...headers,
        Cookie: (await cookies()).toString(),
      },
    });

    return {
      success: true,
      message: res.data?.message || 'Request successful',
      data: res.data?.data || res.data,
    };
  } catch (error: $FixMe) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Request failed',
      data: [] as T,
      errors: error?.response?.data?.errors,
    };
  }
}

const defaultPagination = {
  page: 1,
  limit: 20,
  total: 0,
  hasNextPage: false,
  totalPages: 0,
};

/**
 * Fetches data with pagination support
 * @param endpoint - The API endpoint to fetch from
 * @param params - Pagination parameters (page, limit, search)
 * @param options - Additional axios options
 * @returns Promise with paginated data
 */
export async function fetchDataWithPagination<T>(
  endpoint: string,
  params: PaginationParams,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: $FixMe;
    baseUrl?: string;
    headers?: $FixMe;
  } = {}
): Promise<PaginatedApiResponse<T>> {
  try {
    const { method = 'GET', data, baseUrl, headers } = options;
    const { page, limit = 20, search = '' } = params;

    // Build search parameters
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const res = await axios({
      url: `${baseUrl || BASE_URL}${endpoint}?${searchParams.toString()}`,
      method,
      data,
      headers: {
        ...headers,
        Cookie: (await cookies()).toString(),
      },
    });

    // Extract pagination data from response
    const responseData = res.data?.data || [];
    const pagination = res.data?.pagination || defaultPagination;

    return {
      success: true,
      message: res.data?.message || 'Request successful',
      data: {
        data: responseData,
        pagination,
      },
    };
  } catch (error: $FixMe) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Request failed',
      data: {
        data: [],
        pagination: defaultPagination,
      },
    };
  }
}
