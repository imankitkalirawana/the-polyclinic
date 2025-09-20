'use server';
import { cookies } from 'next/headers';
// eslint-disable-next-line no-restricted-imports
import axios from 'axios';
import type { $FixMe } from '@/types';
import { getSubdomain } from '@/auth/sub-domain';
import { AUTHJS_SESSION_TOKEN } from '@/lib/constants';

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

/**
 * @deprecated use apiRequest from @/lib/axios instead
 */
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
    const { method = 'GET', data = {}, params = {}, baseUrl, headers } = options;

    let url: string;

    if (baseUrl) {
      // ✅ if baseUrl is provided, use it directly
      url = `${baseUrl}${endpoint}`;
    } else {
      // ✅ just use API_BASE_URL as is (no subdomain rewriting)
      url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    }

    // ✅ Get subdomain
    const subdomain = await getSubdomain();
    let finalData = data;
    let finalParams = params;

    if (subdomain) {
      if (method === 'GET') {
        finalParams = {
          ...params,
          organization: subdomain,
        };
      } else {
        finalData = {
          ...data,
          organization: subdomain,
        };
      }
    }

    const cookieStore = await cookies();

    const authjsSessionToken = cookieStore.get(AUTHJS_SESSION_TOKEN)?.value;

    const config = {
      url,
      method,
      data: finalData,
      params: finalParams,
      headers: {
        ...headers,
        Authorization: `Bearer ${authjsSessionToken}`,
      },
    };

    const res = await axios(config);

    if (axios.isAxiosError(res)) {
      console.error('Axios error', res.response?.data);
      return {
        success: false,
        message: res.response?.data?.message || 'Request failed',
        data: [] as T,
        errors: res.response?.data?.errors,
      };
    }

    return {
      success: true,
      message: res.data?.message || 'Request successful',
      data: res.data?.data || res.data,
    };
  } catch (error: $FixMe) {
    console.error('error', error);
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
      url: `${baseUrl || process.env.NEXT_PUBLIC_API_URL}${endpoint}?${searchParams.toString()}`,
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
