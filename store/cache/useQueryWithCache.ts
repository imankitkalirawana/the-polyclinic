import { useEffect, useRef } from 'react';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { ApiResponse } from '@/lib/axios';
import { useCacheStore } from './cache.store';
import { CacheKey, CacheRegistry, CacheConfig } from './cache.types';

/**
 * Configuration for caching to a collection key (e.g., 'patients', 'doctors')
 */
interface CollectionCacheConfig<K extends CacheKey> {
  /** The cache key to store the data under */
  cacheKey: K;
  /** Optional transform function to modify data before caching */
  transform?: (data: CacheRegistry[K]) => CacheRegistry[K];
  /** Cache configuration options */
  config?: CacheConfig;
}

/**
 * Configuration for caching to an indexed key (e.g., 'patientById', 'doctorById')
 */
interface IndexedCacheConfig<K extends CacheKey> {
  /** The index cache key (e.g., 'patientById') */
  indexKey: K;
  /** The ID of the entity being cached */
  entityId: string;
  /** Cache configuration options */
  config?: CacheConfig;
}

/**
 * Cache option - either collection or indexed
 */
type CacheOption<K extends CacheKey> =
  | { type: 'collection'; options: CollectionCacheConfig<K> }
  | { type: 'indexed'; options: IndexedCacheConfig<K> };

/**
 * Query configuration with cache support
 */
interface QueryWithCacheConfig<TData, TError = Error, K extends CacheKey = CacheKey>
  extends Omit<UseQueryOptions<TData, TError>, 'queryFn' | 'queryKey'> {
  queryFn: () => Promise<ApiResponse<TData>>;
  queryKey: unknown[];
  /** Cache configuration - omit to disable caching */
  cache?: CacheOption<K>;
}

/**
 * Return type combines UseQueryResult with cache utilities
 */
type QueryWithCacheResult<TData, TError = Error> = UseQueryResult<TData, TError> & {
  /** Whether the data is from cache (before query completes) */
  isFromCache: boolean;
};

/**
 * Hook that combines React Query with Zustand cache
 *
 * This hook wraps useQuery and automatically syncs successful responses
 * to the Zustand cache store. It provides:
 * - Automatic caching on successful fetches
 * - Type-safe cache key mapping
 * - Support for both collection and indexed caching
 * - Optional data transformation before caching
 *
 * @example
 * ```tsx
 * // Collection caching - stores array of patients
 * const { data: patients } = useQueryWithCache({
 *   queryKey: ['patients', search],
 *   queryFn: () => PatientApi.getAll(search),
 *   cache: {
 *     type: 'collection',
 *     options: { cacheKey: 'patients' }
 *   }
 * });
 *
 * // Indexed caching - stores single patient by ID
 * const { data: patient } = useQueryWithCache({
 *   queryKey: ['patient', patientId],
 *   queryFn: () => PatientApi.getById(patientId),
 *   cache: {
 *     type: 'indexed',
 *     options: { indexKey: 'patientById', entityId: patientId }
 *   }
 * });
 *
 * // No caching - just use React Query normally
 * const { data } = useQueryWithCache({
 *   queryKey: ['something'],
 *   queryFn: () => SomeApi.get(),
 * });
 * ```
 */
export function useQueryWithCache<TData, TError = Error, K extends CacheKey = CacheKey>({
  queryFn,
  queryKey,
  cache,
  ...options
}: QueryWithCacheConfig<TData, TError, K>): QueryWithCacheResult<TData, TError> {
  const setCache = useCacheStore((state) => state.setCache);
  const setIndexedCache = useCacheStore((state) => state.setIndexedCache);

  // Track if we've synced to prevent duplicate syncs
  const hasSyncedRef = useRef(false);
  const lastDataRef = useRef<TData | undefined>(undefined);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await queryFn();
      if (result.success && result.data !== null) {
        return result.data;
      }
      throw new Error(result.message);
    },
    ...options,
  });

  // Sync to cache when data changes
  useEffect(() => {
    if (!cache || !query.data || query.data === lastDataRef.current) {
      return;
    }

    lastDataRef.current = query.data;

    if (cache.type === 'collection') {
      const { cacheKey, transform } = cache.options;
      // Apply transform if provided, otherwise use data directly
      const dataToCache = transform
        ? transform(query.data as unknown as CacheRegistry[K])
        : (query.data as unknown as CacheRegistry[K]);

      setCache(cacheKey, dataToCache);
    } else if (cache.type === 'indexed') {
      const { indexKey, entityId } = cache.options;
      if (entityId) {
        // For indexed cache, we need to extract the value type from the Record
        type IndexedValue = CacheRegistry[K] extends Record<string, infer V> ? V : never;
        setIndexedCache(indexKey, entityId, query.data as unknown as IndexedValue);
      }
    }

    hasSyncedRef.current = true;
  }, [query.data, cache, setCache, setIndexedCache]);

  // Reset sync flag when query key changes
  useEffect(() => {
    hasSyncedRef.current = false;
    lastDataRef.current = undefined;
  }, [JSON.stringify(queryKey)]);

  return {
    ...query,
    isFromCache: hasSyncedRef.current && !query.isFetching,
  };
}

/**
 * Simplified hook for collection caching
 *
 * @example
 * ```tsx
 * const { data: patients } = useCollectionQuery({
 *   queryKey: ['patients'],
 *   queryFn: () => PatientApi.getAll(),
 *   cacheKey: 'patients',
 * });
 * ```
 */
export function useCollectionQuery<TData, TError = Error, K extends CacheKey = CacheKey>({
  queryFn,
  queryKey,
  cacheKey,
  transform,
  ...options
}: Omit<QueryWithCacheConfig<TData, TError, K>, 'cache'> & {
  cacheKey: K;
  transform?: (data: CacheRegistry[K]) => CacheRegistry[K];
}): QueryWithCacheResult<TData, TError> {
  return useQueryWithCache({
    queryFn,
    queryKey,
    cache: {
      type: 'collection',
      options: { cacheKey, transform },
    },
    ...options,
  });
}

/**
 * Simplified hook for indexed (by ID) caching
 *
 * @example
 * ```tsx
 * const { data: patient } = useIndexedQuery({
 *   queryKey: ['patient', patientId],
 *   queryFn: () => PatientApi.getById(patientId),
 *   indexKey: 'patientById',
 *   entityId: patientId,
 *   enabled: !!patientId,
 * });
 * ```
 */
export function useIndexedQuery<TData, TError = Error, K extends CacheKey = CacheKey>({
  queryFn,
  queryKey,
  indexKey,
  entityId,
  ...options
}: Omit<QueryWithCacheConfig<TData, TError, K>, 'cache'> & {
  indexKey: K;
  entityId: string | null | undefined;
}): QueryWithCacheResult<TData, TError> {
  return useQueryWithCache({
    queryFn,
    queryKey,
    cache: entityId
      ? {
          type: 'indexed',
          options: { indexKey, entityId },
        }
      : undefined,
    enabled: options.enabled !== false && !!entityId,
    ...options,
  });
}

/**
 * Hook to manually sync data to cache (useful for mutations or external data)
 *
 * @example
 * ```tsx
 * const syncToCache = useCacheSync();
 *
 * // After a mutation
 * syncToCache('patients', updatedPatients);
 *
 * // Or for indexed
 * syncToCache('patientById', updatedPatient, patientId);
 * ```
 */
export function useCacheSync() {
  const setCache = useCacheStore((state) => state.setCache);
  const setIndexedCache = useCacheStore((state) => state.setIndexedCache);

  function syncToCache<K extends CacheKey>(
    key: K,
    data: CacheRegistry[K],
    entityId?: string
  ): void {
    if (entityId) {
      // Indexed cache
      type IndexedValue = CacheRegistry[K] extends Record<string, infer V> ? V : never;
      setIndexedCache(key, entityId, data as unknown as IndexedValue);
    } else {
      // Collection cache
      setCache(key, data);
    }
  }

  return syncToCache;
}

/**
 * Hook to invalidate cache entries when mutations occur
 *
 * @example
 * ```tsx
 * const invalidateCache = useCacheInvalidation();
 *
 * // After creating a new patient
 * invalidateCache(['patients', 'patientById']);
 * ```
 */
export function useCacheInvalidation() {
  const markManyStale = useCacheStore((state) => state.markManyStale);
  const clearManyCache = useCacheStore((state) => state.clearManyCache);

  return {
    /** Mark cache entries as stale (will refetch on next access) */
    markStale: (keys: CacheKey[]) => markManyStale(keys),
    /** Completely clear cache entries */
    clear: (keys: CacheKey[]) => clearManyCache(keys),
  };
}
