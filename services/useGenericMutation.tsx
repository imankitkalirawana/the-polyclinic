import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToast } from '@heroui/react';
import { ApiResponse } from '@/libs/axios';

interface MutationConfig<TData extends ApiResponse, TVariables, TError = Error> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  invalidateAllQueries?: boolean;
  invalidateQueries?: string[][];
  invalidateQueriesWithVariables?: ({
    variables,
    data,
  }: {
    variables?: TVariables | null;
    data?: TData['data'] | null;
  }) => (string | null | undefined)[][];
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  toastProps?: Record<string, unknown>;
}

/**
 * Generic mutation hook wrapping React Query's `useMutation`.
 *
 * - Handles query invalidation (static and dynamic).
 * - Displays success/error toasts (optional).
 * - Supports custom `onSuccess` and `onError` callbacks.
 *
 * @template TData - Must extend `ApiResponse`, the shape of mutation response.
 * @template TVariables - Input variables passed to the mutation function.
 * @template TError - Error type, defaults to `Error`.
 *
 * @param {Object} config - Mutation configuration.
 * @returns React Query mutation object.
 */

export const useGenericMutation = <TData extends ApiResponse, TVariables, TError = Error>({
  showToast = true,
  mutationFn,
  successMessage,
  errorMessage,
  invalidateAllQueries,
  invalidateQueries = [],
  invalidateQueriesWithVariables,
  onSuccess,
  onError,
  toastProps,
}: MutationConfig<TData, TVariables, TError>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const result = await mutationFn(variables);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (result, variables) => {
      if (invalidateAllQueries) {
        queryClient.invalidateQueries();
      }

      // Invalidate static queries
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries(queryKey ? { queryKey } : undefined);
      });

      // Invalidate dynamic queries with variables
      if (invalidateQueriesWithVariables) {
        const dynamicQueries = invalidateQueriesWithVariables({ variables, data: result.data });
        dynamicQueries.forEach((queryKey) => {
          queryClient.invalidateQueries(queryKey ? { queryKey } : undefined);
        });
      }

      // Show success toast
      if (showToast && (result.message || successMessage)) {
        addToast({
          title: successMessage,
          description: result.message,
          color: 'success',
          ...toastProps,
        });
      }

      // Call custom onSuccess
      onSuccess?.(result, variables);
    },
    onError: (error, variables) => {
      // Show error toast
      if (showToast && (error.message || errorMessage)) {
        addToast({
          title: errorMessage,
          description: error instanceof Error ? error.message : String(error),
          color: 'danger',
          ...toastProps,
        });
      }

      // Call custom onError
      onError?.(error as TError, variables);
    },
  });
};
