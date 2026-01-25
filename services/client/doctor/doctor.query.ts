import { Doctor, DoctorSlots } from './doctor.api';
import { useGenericQuery } from '@/services/useGenericQuery';
import { useGenericMutation } from '@/services/useGenericMutation';
import { useCollectionQuery, useIndexedQuery } from '@/store/cache';

import { SlotConfig } from './doctor.types';

/**
 * Fetch all doctors with automatic caching to Zustand store
 *
 * The fetched doctors are automatically synced to:
 * - `cache.doctors` (collection)
 *
 * @param search - Optional search query
 *
 * @example
 * ```tsx
 * // In a component that fetches doctors
 * const { data: doctors, isLoading } = useAllDoctors(search);
 *
 * // In another component that just needs cached doctors (no fetch)
 * import { useDoctors } from '@/store';
 * const cachedDoctors = useDoctors();
 * ```
 */
export const useAllDoctors = (search?: string) =>
  useCollectionQuery({
    queryKey: ['doctors', search],
    queryFn: () => Doctor.getAll(search),
    cacheKey: 'doctors',
  });

/**
 * Fetch a single doctor by ID with automatic caching to indexed store
 *
 * The fetched doctor is automatically synced to:
 * - `cache.doctorById[id]` (indexed)
 *
 * @param id - The doctor ID
 *
 * @example
 * ```tsx
 * // In a component that fetches a doctor
 * const { data: doctor, isLoading } = useDoctorByIdQuery(doctorId);
 *
 * // In another component that just needs cached doctor (no fetch)
 * import { useDoctorById } from '@/store';
 * const cachedDoctor = useDoctorById(doctorId);
 * ```
 */
export const useDoctorByIdQuery = (id?: string | null) =>
  useIndexedQuery({
    queryKey: ['doctor', id],
    queryFn: () => Doctor.getById(id),
    indexKey: 'doctorById',
    entityId: id,
    enabled: !!id,
  });

/**
 * @deprecated Use `useDoctorByIdQuery` for fetching or `useDoctorById` from '@/store' for cached access
 * This alias is kept for backward compatibility
 */
export const useDoctorById = useDoctorByIdQuery;

// Slots

/**
 * Fetch slots configuration for a doctor by UID
 *
 * @param uid - The doctor UID
 */
export const useSlotsByUID = (uid: string) =>
  useGenericQuery({
    queryKey: ['slots', uid],
    queryFn: () => DoctorSlots.getSlotsByUID(uid),
    enabled: !!uid,
  });

/**
 * Mutation hook to update doctor slots
 *
 * @param uid - The doctor UID
 */
export const useUpdateSlots = (uid: string) => {
  return useGenericMutation({
    mutationFn: (slot: SlotConfig) => DoctorSlots.updateSlotsByUID(uid, slot),
    invalidateQueries: [['slots', uid]],
  });
};
