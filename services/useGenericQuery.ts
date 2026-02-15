import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiResponse } from '@/libs/axios';

interface QueryConfig<TData, TError = Error>
  extends Omit<UseQueryOptions<TData, TError>, 'queryFn' | 'queryKey'> {
  queryFn: () => Promise<ApiResponse<TData>>;
  queryKey: unknown[];
}

/**
 * Generic query hook wrapping React Query's `useQuery`.
 *
 * - Handles the common pattern of checking `result.success`.
 * - Returns `result.data` on success, throws error on failure.
 * - Supports all standard `useQuery` options.
 *
 * @template TData - The type of data returned from the API.
 * @template TError - Error type, defaults to `Error`.
 *
 * @param {Object} config - Query configuration.
 * @returns React Query query object.
 */
export const useGenericQuery = <TData, TError = Error>({
  queryFn,
  queryKey,
  ...options
}: QueryConfig<TData, TError>) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const result = await queryFn();
      if (result.success) {
        return result.data as TData;
      }
      throw new Error(result.message);
    },
    ...options,
  });
};
