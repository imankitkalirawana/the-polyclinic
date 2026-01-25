import { PatientApi } from './patient.api';
import { useGenericQuery } from '@/services/useGenericQuery';
import { useCollectionQuery, useIndexedQuery } from '@/store/cache';

/**
 * Fetch all patients with automatic caching to Zustand store
 *
 * The fetched patients are automatically synced to:
 * - `cache.patients` (collection)
 *
 * @param search - Optional search query
 *
 * @example
 * ```tsx
 * // In a component that fetches patients
 * const { data: patients, isLoading } = useAllPatients(search);
 *
 * // In another component that just needs cached patients (no fetch)
 * import { useCacheValue } from '@/store';
 * const cachedPatients = useCacheValue('patients');
 * ```
 */
export const useAllPatients = (search?: string) =>
  useCollectionQuery({
    queryKey: ['patients', search],
    queryFn: () => PatientApi.getAll(search),
    cacheKey: 'patients',
  });

/**
 * Fetch a single patient by ID with automatic caching to indexed store
 *
 * The fetched patient is automatically synced to:
 * - `cache.patientById[id]` (indexed)
 *
 * @param id - The patient ID
 *
 * @example
 * ```tsx
 * // In a component that fetches a patient
 * const { data: patient, isLoading } = usePatientByIdQuery(patientId);
 *
 * // In another component that just needs cached patient (no fetch)
 * import { usePatientById } from '@/store';
 * const cachedPatient = usePatientById(patientId);
 * ```
 */
export const usePatientByIdQuery = (id?: string | null) =>
  useIndexedQuery({
    queryKey: ['patient', id],
    queryFn: () => PatientApi.getById(id),
    indexKey: 'patientById',
    entityId: id,
    enabled: !!id,
  });

/**
 * @deprecated Use `usePatientByIdQuery` for fetching or `usePatientById` from '@/store' for cached access
 * This alias is kept for backward compatibility
 */
export { usePatientByIdQuery as usePatientById };

/**
 * Fetch previous appointments for a patient
 *
 * @param uid - The patient UID
 */
export const usePreviousAppointments = (uid?: string | null) =>
  useGenericQuery({
    queryKey: ['previous-appointments', uid],
    queryFn: () => PatientApi.getPreviousAppointments(uid),
    enabled: !!uid,
  });
