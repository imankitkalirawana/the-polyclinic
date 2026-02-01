import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { CacheRegistry, CacheKey, CacheValue, cacheDefaults, CacheConfig } from './cache.types';

/**
 * Cache metadata for tracking staleness and timestamps
 */
type CacheMetadata = {
  [K in CacheKey]?: {
    timestamp: number;
    stale: boolean;
  };
};

/**
 * Cache store state interface
 */
interface CacheStoreState {
  /** The cached data */
  cache: CacheRegistry;
  /** Metadata about cache entries */
  metadata: CacheMetadata;

  /**
   * Set a value in the cache with full type safety
   * @param key - The cache key
   * @param value - The value to cache (must match the type for this key)
   * @param config - Optional cache configuration
   */
  setCache: <K extends CacheKey>(key: K, value: CacheValue<K>, config?: CacheConfig) => void;

  /**
   * Get a value from the cache with full type safety
   * @param key - The cache key
   * @returns The cached value or the default value for this key
   */
  getCache: <K extends CacheKey>(key: K) => CacheValue<K>;

  /**
   * Check if a cache entry exists and is not stale
   * @param key - The cache key
   * @param maxAge - Optional max age in milliseconds
   * @returns Whether the cache entry is fresh
   */
  isCacheFresh: (key: CacheKey, maxAge?: number) => boolean;

  /**
   * Update an indexed cache entry (e.g., patientById)
   * @param indexKey - The index cache key (e.g., 'patientById')
   * @param entityId - The ID of the entity
   * @param value - The entity value
   */
  setIndexedCache: <K extends CacheKey>(
    indexKey: K,
    entityId: string,
    value: CacheRegistry[K] extends Record<string, infer V> ? V : never
  ) => void;

  /**
   * Get an entity from an indexed cache
   * @param indexKey - The index cache key
   * @param entityId - The ID of the entity
   */
  getIndexedCache: <K extends CacheKey>(
    indexKey: K,
    entityId: string
  ) => CacheRegistry[K] extends Record<string, infer V> ? V | undefined : never;

  /**
   * Mark a cache entry as stale
   * @param key - The cache key to mark as stale
   */
  markStale: (key: CacheKey) => void;

  /**
   * Mark multiple cache entries as stale
   * @param keys - The cache keys to mark as stale
   */
  markManyStale: (keys: CacheKey[]) => void;

  /**
   * Clear a specific cache entry
   * @param key - The cache key to clear
   */
  clearCache: (key: CacheKey) => void;

  /**
   * Clear multiple cache entries
   * @param keys - The cache keys to clear
   */
  clearManyCache: (keys: CacheKey[]) => void;

  /**
   * Clear all cache entries
   */
  clearAllCache: () => void;

  /**
   * Bulk set multiple cache entries
   * @param entries - Object with cache keys and values
   */
  setBulkCache: (entries: Partial<CacheRegistry>) => void;
}

/**
 * Default stale time (5 minutes)
 */
const DEFAULT_STALE_TIME = 5 * 60 * 1000;

/**
 * Zustand cache store with full type safety
 *
 * This store integrates with React Query to provide:
 * - Persistent state across component unmounts
 * - Type-safe access to cached entities
 * - Automatic staleness tracking
 * - Indexed entity storage for O(1) lookups
 *
 * @example
 * ```tsx
 * // In a component
 * const patients = useCacheStore((state) => state.cache.patients);
 * const setCache = useCacheStore((state) => state.setCache);
 *
 * // Set cache with full type safety
 * setCache('patients', patientsArray);
 *
 * // Get from indexed cache
 * const patient = useCacheStore((state) =>
 *   state.getIndexedCache('patientById', patientId)
 * );
 * ```
 */
export const useCacheStore = create<CacheStoreState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      cache: { ...cacheDefaults },
      metadata: {},

      setCache: <K extends CacheKey>(key: K, value: CacheValue<K>, _config?: CacheConfig) => {
        set(
          (state) => ({
            cache: {
              ...state.cache,
              [key]: value,
            },
            metadata: {
              ...state.metadata,
              [key]: {
                timestamp: Date.now(),
                stale: false,
              },
            },
          }),
          undefined,
          `cache/set/${key}`
        );
      },

      getCache: <K extends CacheKey>(key: K): CacheValue<K> => {
        return get().cache[key];
      },

      isCacheFresh: (key: CacheKey, maxAge: number = DEFAULT_STALE_TIME) => {
        const meta = get().metadata[key];
        if (!meta) return false;
        if (meta.stale) return false;
        return Date.now() - meta.timestamp < maxAge;
      },

      setIndexedCache: <K extends CacheKey>(
        indexKey: K,
        entityId: string,
        value: CacheRegistry[K] extends Record<string, infer V> ? V : never
      ) => {
        set(
          (state) => {
            const currentIndex = state.cache[indexKey];
            // Type guard to ensure we're working with a Record
            if (
              typeof currentIndex !== 'object' ||
              currentIndex === null ||
              Array.isArray(currentIndex)
            ) {
              console.warn(`Cache key ${indexKey} is not an indexed cache`);
              return state;
            }

            return {
              cache: {
                ...state.cache,
                [indexKey]: {
                  ...(currentIndex as Record<string, unknown>),
                  [entityId]: value,
                },
              },
              metadata: {
                ...state.metadata,
                [indexKey]: {
                  timestamp: Date.now(),
                  stale: false,
                },
              },
            };
          },
          undefined,
          `cache/setIndexed/${indexKey}/${entityId}`
        );
      },

      getIndexedCache: <K extends CacheKey>(
        indexKey: K,
        entityId: string
      ): CacheRegistry[K] extends Record<string, infer V> ? V | undefined : never => {
        const index = get().cache[indexKey];
        if (typeof index !== 'object' || index === null || Array.isArray(index)) {
          return undefined as CacheRegistry[K] extends Record<string, infer V>
            ? V | undefined
            : never;
        }
        return (index as Record<string, unknown>)[entityId] as CacheRegistry[K] extends Record<
          string,
          infer V
        >
          ? V | undefined
          : never;
      },

      markStale: (key: CacheKey) => {
        set(
          (state) => ({
            metadata: {
              ...state.metadata,
              [key]: {
                ...state.metadata[key],
                timestamp: state.metadata[key]?.timestamp ?? 0,
                stale: true,
              },
            },
          }),
          undefined,
          `cache/markStale/${key}`
        );
      },

      markManyStale: (keys: CacheKey[]) => {
        set(
          (state) => {
            const updatedMetadata = { ...state.metadata };
            keys.forEach((key) => {
              updatedMetadata[key] = {
                timestamp: state.metadata[key]?.timestamp ?? 0,
                stale: true,
              };
            });
            return { metadata: updatedMetadata };
          },
          undefined,
          'cache/markManyStale'
        );
      },

      clearCache: (key: CacheKey) => {
        set(
          (state) => {
            const newMetadata = { ...state.metadata };
            delete newMetadata[key];

            return {
              cache: {
                ...state.cache,
                [key]: cacheDefaults[key],
              },
              metadata: newMetadata,
            };
          },
          undefined,
          `cache/clear/${key}`
        );
      },

      clearManyCache: (keys: CacheKey[]) => {
        set(
          (state) => {
            const newCache: CacheRegistry = { ...state.cache };
            const newMetadata = { ...state.metadata };

            keys.forEach((key) => {
              // Use Object.assign to avoid TypeScript's strict type narrowing
              Object.assign(newCache, { [key]: cacheDefaults[key] });
              delete newMetadata[key];
            });

            return {
              cache: newCache,
              metadata: newMetadata,
            };
          },
          undefined,
          'cache/clearMany'
        );
      },

      clearAllCache: () => {
        set(
          {
            cache: { ...cacheDefaults },
            metadata: {},
          },
          undefined,
          'cache/clearAll'
        );
      },

      setBulkCache: (entries: Partial<CacheRegistry>) => {
        set(
          (state) => {
            const timestamp = Date.now();
            const newMetadata = { ...state.metadata };

            (Object.keys(entries) as CacheKey[]).forEach((key) => {
              newMetadata[key] = {
                timestamp,
                stale: false,
              };
            });

            return {
              cache: {
                ...state.cache,
                ...entries,
              },
              metadata: newMetadata,
            };
          },
          undefined,
          'cache/setBulk'
        );
      },
    })),
    {
      name: 'CacheStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

/**
 * Type-safe selector hooks for common cache access patterns
 */

/**
 * Hook to get a specific cache value
 * @param key - The cache key
 * @returns The cached value
 */
export function useCacheValue<K extends CacheKey>(key: K): CacheValue<K> {
  return useCacheStore((state) => state.cache[key]);
}

/**
 * Hook to get cache setter function
 * @returns The setCache function
 */
export function useCacheSetter() {
  return useCacheStore((state) => state.setCache);
}

/**
 * Hook to get an entity from indexed cache
 * @param indexKey - The index cache key
 * @param entityId - The entity ID
 * @returns The entity or undefined
 */
export function useIndexedCacheValue<K extends CacheKey>(
  indexKey: K,
  entityId: string | null | undefined
): CacheRegistry[K] extends Record<string, infer V> ? V | undefined : never {
  return useCacheStore((state) => {
    if (!entityId) {
      return undefined as CacheRegistry[K] extends Record<string, infer V> ? V | undefined : never;
    }
    return state.getIndexedCache(indexKey, entityId);
  });
}

/**
 * Hook to check if cache is fresh
 * @param key - The cache key
 * @param maxAge - Optional max age in milliseconds
 * @returns Whether the cache is fresh
 */
export function useIsCacheFresh(key: CacheKey, maxAge?: number): boolean {
  return useCacheStore((state) => state.isCacheFresh(key, maxAge));
}
