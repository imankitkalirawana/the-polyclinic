/**
 * Cache Module
 *
 * This module provides a type-safe integration between React Query and Zustand
 * for caching API responses. It enables automatic syncing of fetched data to
 * a centralized Zustand store, eliminating redundant API calls.
 *
 * @example
 * ```tsx
 * // In your query file - enable caching
 * export const useAllPatients = (search?: string) =>
 *   useCollectionQuery({
 *     queryKey: ['patients', search],
 *     queryFn: () => PatientApi.getAll(search),
 *     cacheKey: 'patients',
 *   });
 *
 * // In a component - read from cache without fetching
 * const cachedPatient = usePatientById(patientId);
 *
 * // Or use the selected entity pattern
 * const selectedPatient = useSelectedPatient();
 * const setCache = useCacheSetter();
 * setCache('selectedPatient', patient);
 * ```
 */

// Types
export type {
  CacheRegistry,
  CacheKey,
  CacheValue,
  CacheEntry,
  CacheConfig,
  CacheOptions,
  IndexedCacheOptions,
} from './cache.types';

export { cacheDefaults, isCacheKey } from './cache.types';

// Store
export {
  useCacheStore,
  useCacheValue,
  useCacheSetter,
  useIndexedCacheValue,
  useIsCacheFresh,
} from './cache.store';

// Query hooks with cache integration
export type { IndexedCacheFetchConfig } from './useQueryWithCache';
export {
  useQueryWithCache,
  useCollectionQuery,
  useIndexedQuery,
  useIndexedCacheValueOrFetch,
  useCacheSync,
  useCacheInvalidation,
} from './useQueryWithCache';
