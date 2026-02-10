# Cache Module Documentation

A type-safe integration between React Query and Zustand for automatic caching of API responses in The Polyclinic application.

## Overview

This module solves the problem of redundant API calls by automatically syncing React Query responses to a centralized Zustand store. Once data is fetched, it's available throughout the application without additional network requests.

### Key Features

- ✅ **Zero Redundant Fetches**: Data fetched once is available everywhere
- ✅ **Full Type Safety**: No `as` assertions, complete TypeScript inference
- ✅ **Backward Compatible**: Existing code continues to work
- ✅ **DevTools Support**: Integrated with Redux DevTools for debugging
- ✅ **Flexible Architecture**: Support for collections, indexed entities, and selections

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Components                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐              ┌──────────────────────────┐ │
│  │  React Query     │   auto-sync  │     Zustand Cache        │ │
│  │  (Data Fetching) │ ──────────►  │  (Persistent State)      │ │
│  │                  │              │                          │ │
│  │  useAllPatients  │              │  cache.patients          │ │
│  │  useAllDoctors   │              │  cache.doctors           │ │
│  │  useDoctorByIdQ  │              │  cache.doctorById[id]    │ │
│  └──────────────────┘              └──────────────────────────┘ │
│                                                                  │
│  Components that fetch  ◄──────────►  Components that read      │
│  (trigger API calls)                 (no API calls needed)      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Fetching with Automatic Caching

Update your query files to use the caching hooks:

```tsx
// services/client/patient/patient.query.ts
import { useCollectionQuery, useIndexedQuery } from '@/store/cache';

// Fetches patients AND caches them automatically
export const useAllPatients = (search?: string) =>
  useCollectionQuery({
    queryKey: ['patients', search],
    queryFn: () => PatientApi.getAll(search),
    cacheKey: 'patients', // ← This enables caching
  });

// Fetches a patient by ID AND caches it indexed by ID
export const usePatientByIdQuery = (id?: string | null) =>
  useIndexedQuery({
    queryKey: ['patient', id],
    queryFn: () => PatientApi.getById(id),
    indexKey: 'patientById', // ← Cache key for indexed storage
    entityId: id, // ← The ID to index by
    enabled: !!id,
  });
```

### 2. Reading Cached Data (No Fetch)

In components that just need the data without fetching:

```tsx
// components/dashboard/appointments/queue/new/review-n-pay/index.tsx
import { usePatientById, useDoctorById } from '@/store';

export default function ReviewAndPay() {
  const form = useFormContext();
  const appointment = form.watch('appointment');

  // Read from cache - NO API calls!
  const patient = usePatientById(appointment.patientId);
  const doctor = useDoctorById(appointment.doctorId);

  return (
    <div>
      <p>Patient: {patient?.name}</p>
      <p>Doctor: {doctor?.name}</p>
    </div>
  );
}
```

### 3. Manually Caching Data

When you need to cache data from selections or mutations:

```tsx
import { useCacheStore } from '@/store';

function PatientSelection() {
  const { data: patients } = useAllPatients();
  const setIndexedCache = useCacheStore((state) => state.setIndexedCache);

  const handlePatientSelect = (id: string) => {
    // Cache the selected patient for later use
    const patient = patients?.find((p) => p.id === id);
    if (patient) {
      setIndexedCache('patientById', id, patient);
    }
  };

  return (/* ... */);
}
```

## API Reference

### Cache Keys

The cache registry defines all available cache keys and their types:

| Key                 | Type                          | Description                          |
| ------------------- | ----------------------------- | ------------------------------------ |
| `patients`          | `PatientType[]`               | All patients collection              |
| `doctors`           | `DoctorType[]`                | All doctors collection               |
| `departments`       | `DepartmentType[]`            | All departments collection           |
| `services`          | `ServiceType[]`               | All services collection              |
| `drugs`             | `DrugType[]`                  | All drugs collection                 |
| `appointments`      | `AppointmentType[]`           | All appointments collection          |
| `appointmentQueues` | `AppointmentQueueType[]`      | All queue appointments               |
| `users`             | `UserType[]`                  | All users collection                 |
| `selectedPatient`   | `PatientType \| null`         | Currently selected patient           |
| `selectedDoctor`    | `DoctorType \| null`          | Currently selected doctor            |
| `patientById`       | `Record<string, PatientType>` | Patients indexed by ID               |
| `doctorById`        | `Record<string, DoctorType>`  | Doctors indexed by ID                |
| ...                 | ...                           | (See `cache.types.ts` for full list) |

### Query Hooks

#### `useCollectionQuery`

Fetches and caches a collection of entities.

```tsx
const { data, isLoading, error, isFromCache } = useCollectionQuery({
  queryKey: ['patients', search],
  queryFn: () => PatientApi.getAll(search),
  cacheKey: 'patients',
  transform?: (data) => data, // Optional transformation
  // ...all other React Query options
});
```

#### `useIndexedQuery`

Fetches and caches a single entity indexed by ID.

```tsx
const { data, isLoading, error, isFromCache } = useIndexedQuery({
  queryKey: ['patient', id],
  queryFn: () => PatientApi.getById(id),
  indexKey: 'patientById',
  entityId: id,
  enabled: !!id,
  // ...all other React Query options
});
```

#### `useQueryWithCache`

Low-level hook for custom caching scenarios.

```tsx
const result = useQueryWithCache({
  queryKey: ['custom'],
  queryFn: () => CustomApi.get(),
  cache: {
    type: 'collection', // or 'indexed'
    options: { cacheKey: 'patients' },
  },
});
```

### Selector Hooks

#### Reading collections from cache

```tsx
import { useCacheValue } from '@/store';

const patients = useCacheValue('patients'); // PatientType[]
const doctors = useCacheValue('doctors'); // DoctorType[]
const services = useCacheValue('services'); // ServiceType[]
```

#### Indexed Selectors (by ID)

```tsx
import { usePatientById, useDoctorById } from '@/store';

const patient = usePatientById(patientId); // PatientType | undefined
const doctor = useDoctorById(doctorId); // DoctorType | undefined
```

#### Selected Entity Selectors

```tsx
import { useSelectedPatient, useCacheSetter } from '@/store';

const selectedPatient = useSelectedPatient(); // PatientType | null
const setCache = useCacheSetter();
setCache('selectedPatient', patient); // Updates selectedPatient
```

### Store Actions

Access store actions directly:

```tsx
import { useCacheStore } from '@/store';

const {
  setCache, // Set a cache value
  getCache, // Get a cache value
  setIndexedCache, // Set an indexed cache entry
  getIndexedCache, // Get an indexed cache entry
  markStale, // Mark cache as stale
  markManyStale, // Mark multiple caches as stale
  clearCache, // Clear a cache entry
  clearManyCache, // Clear multiple cache entries
  clearAllCache, // Clear all cache
  setBulkCache, // Set multiple cache entries at once
  isCacheFresh, // Check if cache is fresh
} = useCacheStore();
```

## Usage Patterns

### Pattern 1: Multi-Step Forms

Perfect for wizards where data is selected in early steps and displayed in later steps:

```tsx
// Step 1: Patient Selection (fetches and caches)
const { data: patients } = useAllPatients();
const setIndexedCache = useCacheStore((s) => s.setIndexedCache);

const handleSelect = (id: string) => {
  const patient = patients?.find((p) => p.id === id);
  if (patient) setIndexedCache('patientById', id, patient);
};

// Step 3: Review (reads from cache)
const patient = usePatientById(selectedPatientId); // No fetch!
```

### Pattern 2: Detail Views with Fallback

Show cached data immediately, fetch fresh data in background:

```tsx
function PatientDetails({ id }: { id: string }) {
  // Try cache first
  const cachedPatient = usePatientById(id);

  // Fetch fresh data (will update cache automatically)
  const { data: freshPatient, isLoading } = usePatientByIdQuery(id);

  // Use cached data while loading, fresh data when available
  const patient = freshPatient ?? cachedPatient;

  if (!patient && isLoading) return <Skeleton />;
  if (!patient) return <NotFound />;

  return <PatientCard patient={patient} />;
}
```

### Pattern 3: Cache Invalidation After Mutations

```tsx
import { useCacheInvalidation } from '@/store';

function useUpdatePatient() {
  const { markStale, clear } = useCacheInvalidation();

  return useMutation({
    mutationFn: PatientApi.update,
    onSuccess: () => {
      // Option 1: Mark as stale (will refetch on next access)
      markStale(['patients', 'patientById']);

      // Option 2: Clear completely
      clear(['patients']);
    },
  });
}
```

## Adding New Entity Types

To add caching for a new entity type:

### 1. Update the Cache Registry

```tsx
// store/cache/cache.types.ts
import { NewEntityType } from '@/services/client/new-entity/new-entity.types';

export interface CacheRegistry {
  // ... existing entries

  // Add collection
  newEntities: NewEntityType[];

  // Add selected
  selectedNewEntity: NewEntityType | null;

  // Add indexed
  newEntityById: Record<string, NewEntityType>;
}

// Update cacheDefaults
export const cacheDefaults: CacheRegistry = {
  // ... existing defaults
  newEntities: [],
  selectedNewEntity: null,
  newEntityById: {},
};

// Update isCacheKey
export function isCacheKey(key: string): key is CacheKey {
  const validKeys: CacheKey[] = [
    // ... existing keys
    'newEntities',
    'selectedNewEntity',
    'newEntityById',
  ];
  return validKeys.includes(key as CacheKey);
}
```

### 2. Add Selectors

```tsx
// store/cache/selectors.ts
import { NewEntityType } from '@/services/client/new-entity/new-entity.types';

export function useNewEntities(): NewEntityType[] {
  return useCacheStore((state) => state.cache.newEntities);
}

export function useNewEntityById(id: string | null | undefined): NewEntityType | undefined {
  return useCacheStore((state) => {
    if (!id) return undefined;
    return state.cache.newEntityById[id];
  });
}

export function useSelectedNewEntity(): NewEntityType | null {
  return useCacheStore((state) => state.cache.selectedNewEntity);
}

export function useSetSelectedNewEntity() {
  const setCache = useCacheStore((state) => state.setCache);
  return (entity: NewEntityType | null) => setCache('selectedNewEntity', entity);
}
```

### 3. Export from Index

```tsx
// store/cache/index.ts
export {
  useNewEntities,
  useNewEntityById,
  useSelectedNewEntity,
  useSetSelectedNewEntity,
} from './selectors';
```

### 4. Update Query Files

```tsx
// services/client/new-entity/new-entity.query.ts
import { useCollectionQuery, useIndexedQuery } from '@/store/cache';

export const useAllNewEntities = () =>
  useCollectionQuery({
    queryKey: ['new-entities'],
    queryFn: () => NewEntityApi.getAll(),
    cacheKey: 'newEntities',
  });

export const useNewEntityByIdQuery = (id?: string | null) =>
  useIndexedQuery({
    queryKey: ['new-entity', id],
    queryFn: () => NewEntityApi.getById(id),
    indexKey: 'newEntityById',
    entityId: id,
    enabled: !!id,
  });
```

## Debugging

### Redux DevTools

The cache store integrates with Redux DevTools. Open DevTools and look for `CacheStore` to inspect:

- Current cache state
- Cache metadata (timestamps, staleness)
- Action history (`cache/set/patients`, `cache/setIndexed/patientById/123`, etc.)

### Checking Cache Freshness

```tsx
import { useIsCacheFresh, useCacheStore } from '@/store';

function DebugPanel() {
  const isFresh = useIsCacheFresh('patients', 5 * 60 * 1000); // 5 min
  const metadata = useCacheStore((s) => s.metadata['patients']);

  return (
    <div>
      <p>Fresh: {isFresh ? 'Yes' : 'No'}</p>
      <p>Last updated: {new Date(metadata?.timestamp ?? 0).toISOString()}</p>
      <p>Stale: {metadata?.stale ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

## Best Practices

1. **Use collection caching for list views**: When fetching lists that will be displayed or searched.

2. **Use indexed caching for details**: When fetching individual entities that might be accessed by ID later.

3. **Cache on selection**: When a user selects an entity from a list, cache it immediately for downstream use.

4. **Prefer selectors over direct store access**: Use the provided selector hooks for better performance and type safety.

5. **Invalidate on mutations**: Always invalidate or update the cache after create/update/delete operations.

6. **Don't over-cache**: Not every API response needs caching. Use caching for data that's reused across components.

## Migration Guide

### From `useGenericQuery` to `useCollectionQuery`

```diff
- import { useGenericQuery } from '@/services/useGenericQuery';
+ import { useCollectionQuery } from '@/store/cache';

  export const useAllPatients = (search?: string) =>
-   useGenericQuery({
+   useCollectionQuery({
      queryKey: ['patients', search],
      queryFn: () => PatientApi.getAll(search),
+     cacheKey: 'patients',
    });
```

### Reading cached data instead of re-fetching

```diff
- import { useDoctorById } from '@/services/client/doctor/doctor.query';
+ import { useDoctorById } from '@/store';

  function ReviewComponent() {
-   const { data: doctor } = useDoctorById(doctorId);
+   const doctor = useDoctorById(doctorId);  // No fetch, reads from cache

    return <div>{doctor?.name}</div>;
  }
```
