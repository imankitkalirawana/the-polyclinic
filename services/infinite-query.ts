import { useInfiniteQuery } from '@tanstack/react-query';

import { PaginationResponse, PaginatedApiResponse } from './fetch';

const defaultOptions = {
  limit: 20,
  staleTime: 5 * 60 * 1000,
  enabled: true,
};

/**
 * Generic hook for infinite queries with search and pagination
 * @param queryKey - The query key for React Query
 * @param queryFn - Function that fetches paginated data
 * @param search - Search term
 * @param options - Additional options for the infinite query
 * @returns Infinite query result
 */
export function useInfiniteQueryWithSearch<T>({
  queryKey,
  queryFn,
  search = '',
  options = defaultOptions,
}: {
  queryKey: string[];
  queryFn: (params: {
    page: number;
    limit?: number;
    search?: string;
  }) => Promise<PaginatedApiResponse<T>>;
  search?: string;
  options?: {
    limit?: number;
    staleTime?: number;
    enabled?: boolean;
  };
}) {
  const { limit, staleTime, enabled } = options;

  return useInfiniteQuery({
    queryKey: [...queryKey, search],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await queryFn({
        page: pageParam,
        limit,
        search,
      });
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginationResponse<T>) => {
      return lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined;
    },
    staleTime,
    enabled,
  });
}
