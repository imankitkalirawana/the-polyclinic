import { useCacheStore } from './cache.store';
import { CacheRegistry, CacheKey } from './cache.types';
import { PatientType } from '@/services/client/patient';
import { DoctorType } from '@/services/client/doctor';
import { DepartmentType } from '@/services/client/department/department.types';
import { ServiceType } from '@/services/client/service/service.types';
import { DrugType } from '@/services/client/drug/drug.types';
import { AppointmentType } from '@/services/client/appointment/appointment.types';
import { AppointmentQueueResponse } from '@/services/client/appointment/queue/queue.types';
import { UserType } from '@/services/common/user/user.types';

/**
 * ============================================================================
 * COLLECTION SELECTORS
 * ============================================================================
 * These selectors return arrays of entities from the cache
 */

/**
 * Select all patients from cache
 */
export function usePatients(): PatientType[] {
  return useCacheStore((state) => state.cache.patients);
}

/**
 * Select all doctors from cache
 */
export function useDoctors(): DoctorType[] {
  return useCacheStore((state) => state.cache.doctors);
}

/**
 * Select all departments from cache
 */
export function useDepartments(): DepartmentType[] {
  return useCacheStore((state) => state.cache.departments);
}

/**
 * Select all services from cache
 */
export function useServices(): ServiceType[] {
  return useCacheStore((state) => state.cache.services);
}

/**
 * Select all drugs from cache
 */
export function useDrugs(): DrugType[] {
  return useCacheStore((state) => state.cache.drugs);
}

/**
 * Select all appointments from cache
 */
export function useAppointments(): AppointmentType[] {
  return useCacheStore((state) => state.cache.appointments);
}

/**
 * Select all appointment queues from cache
 */
export function useAppointmentQueues(): AppointmentQueueResponse[] {
  return useCacheStore((state) => state.cache.appointmentQueues);
}

/**
 * Select all users from cache
 */
export function useUsers(): UserType[] {
  return useCacheStore((state) => state.cache.users);
}

/**
 * ============================================================================
 * SELECTED ENTITY SELECTORS
 * ============================================================================
 * These selectors return the currently selected entity
 */

/**
 * Select the currently selected patient
 */
export function useSelectedPatient(): PatientType | null {
  return useCacheStore((state) => state.cache.selectedPatient);
}

/**
 * Select the currently selected doctor
 */
export function useSelectedDoctor(): DoctorType | null {
  return useCacheStore((state) => state.cache.selectedDoctor);
}

/**
 * Select the currently selected department
 */
export function useSelectedDepartment(): DepartmentType | null {
  return useCacheStore((state) => state.cache.selectedDepartment);
}

/**
 * Select the currently selected service
 */
export function useSelectedService(): ServiceType | null {
  return useCacheStore((state) => state.cache.selectedService);
}

/**
 * Select the currently selected drug
 */
export function useSelectedDrug(): DrugType | null {
  return useCacheStore((state) => state.cache.selectedDrug);
}

/**
 * Select the currently selected appointment
 */
export function useSelectedAppointment(): AppointmentType | null {
  return useCacheStore((state) => state.cache.selectedAppointment);
}

/**
 * Select the currently selected appointment queue
 */
export function useSelectedAppointmentQueue(): AppointmentQueueResponse | null {
  return useCacheStore((state) => state.cache.selectedAppointmentQueue);
}

/**
 * Select the currently selected user
 */
export function useSelectedUser(): UserType | null {
  return useCacheStore((state) => state.cache.selectedUser);
}

/**
 * ============================================================================
 * INDEXED ENTITY SELECTORS
 * ============================================================================
 * These selectors return entities by ID from the indexed cache
 */

/**
 * Select a patient by ID from the indexed cache
 * @param id - The patient ID
 */
export function usePatientById(id: string | null | undefined): PatientType | undefined {
  return useCacheStore((state) => {
    if (!id) return undefined;
    return state.cache.patientById[id];
  });
}

/**
 * Select a doctor by ID from the indexed cache
 * @param id - The doctor ID
 */
export function useDoctorById(id: string | null | undefined): DoctorType | undefined {
  return useCacheStore((state) => {
    if (!id) return undefined;
    return state.cache.doctorById[id];
  });
}

/**
 * Select a department by ID from the indexed cache
 * @param id - The department ID
 */
export function useDepartmentById(id: string | null | undefined): DepartmentType | undefined {
  return useCacheStore((state) => {
    if (!id) return undefined;
    return state.cache.departmentById[id];
  });
}

/**
 * Select a service by ID from the indexed cache
 * @param id - The service ID
 */
export function useServiceById(id: string | null | undefined): ServiceType | undefined {
  return useCacheStore((state) => {
    if (!id) return undefined;
    return state.cache.serviceById[id];
  });
}

/**
 * Select a drug by ID from the indexed cache
 * @param id - The drug ID
 */
export function useDrugById(id: string | null | undefined): DrugType | undefined {
  return useCacheStore((state) => {
    if (!id) return undefined;
    return state.cache.drugById[id];
  });
}

/**
 * Select an appointment by ID from the indexed cache
 * @param id - The appointment ID
 */
export function useAppointmentById(id: string | null | undefined): AppointmentType | undefined {
  return useCacheStore((state) => {
    if (!id) return undefined;
    return state.cache.appointmentById[id];
  });
}

/**
 * Select an appointment queue by ID from the indexed cache
 * @param id - The appointment queue ID
 */
export function useAppointmentQueueById(
  id: string | null | undefined
): AppointmentQueueResponse | undefined {
  return useCacheStore((state) => {
    if (!id) return undefined;
    return state.cache.appointmentQueueById[id];
  });
}

/**
 * Select a user by ID from the indexed cache
 * @param id - The user ID
 */
export function useUserById(id: string | null | undefined): UserType | undefined {
  return useCacheStore((state) => {
    if (!id) return undefined;
    return state.cache.userById[id];
  });
}

/**
 * ============================================================================
 * SETTER SELECTORS
 * ============================================================================
 * These selectors return functions to update the cache
 */

/**
 * Get the setter for selected patient
 */
export function useSetSelectedPatient() {
  const setCache = useCacheStore((state) => state.setCache);
  return (patient: PatientType | null) => setCache('selectedPatient', patient);
}

/**
 * Get the setter for selected doctor
 */
export function useSetSelectedDoctor() {
  const setCache = useCacheStore((state) => state.setCache);
  return (doctor: DoctorType | null) => setCache('selectedDoctor', doctor);
}

/**
 * Get the setter for selected department
 */
export function useSetSelectedDepartment() {
  const setCache = useCacheStore((state) => state.setCache);
  return (department: DepartmentType | null) => setCache('selectedDepartment', department);
}

/**
 * Get the setter for selected service
 */
export function useSetSelectedService() {
  const setCache = useCacheStore((state) => state.setCache);
  return (service: ServiceType | null) => setCache('selectedService', service);
}

/**
 * Get the setter for selected drug
 */
export function useSetSelectedDrug() {
  const setCache = useCacheStore((state) => state.setCache);
  return (drug: DrugType | null) => setCache('selectedDrug', drug);
}

/**
 * Get the setter for selected appointment
 */
export function useSetSelectedAppointment() {
  const setCache = useCacheStore((state) => state.setCache);
  return (appointment: AppointmentType | null) => setCache('selectedAppointment', appointment);
}

/**
 * Get the setter for selected appointment queue
 */
export function useSetSelectedAppointmentQueue() {
  const setCache = useCacheStore((state) => state.setCache);
  return (queue: AppointmentQueueResponse | null) => setCache('selectedAppointmentQueue', queue);
}

/**
 * Get the setter for selected user
 */
export function useSetSelectedUser() {
  const setCache = useCacheStore((state) => state.setCache);
  return (user: UserType | null) => setCache('selectedUser', user);
}

/**
 * ============================================================================
 * GENERIC SELECTOR
 * ============================================================================
 * A generic selector for any cache key
 */

/**
 * Generic selector for any cache key
 * @param key - The cache key
 */
export function useCacheSelector<K extends CacheKey>(key: K): CacheRegistry[K] {
  return useCacheStore((state) => state.cache[key]);
}

/**
 * Generic setter for any cache key
 * @param key - The cache key
 */
export function useCacheSetter<K extends CacheKey>(key: K) {
  const setCache = useCacheStore((state) => state.setCache);
  return (value: CacheRegistry[K]) => setCache(key, value);
}

/**
 * ============================================================================
 * UTILITY SELECTORS
 * ============================================================================
 */

/**
 * Check if a cache entry is fresh
 * @param key - The cache key
 * @param maxAge - Maximum age in milliseconds (default: 5 minutes)
 */
export function useCacheFreshness(key: CacheKey, maxAge?: number): boolean {
  return useCacheStore((state) => state.isCacheFresh(key, maxAge));
}

/**
 * Get cache metadata for a key
 * @param key - The cache key
 */
export function useCacheMetadata(key: CacheKey) {
  return useCacheStore((state) => state.metadata[key]);
}

/**
 * Get all cache actions (for advanced use cases)
 */
export function useCacheActions() {
  return useCacheStore((state) => ({
    setCache: state.setCache,
    getCache: state.getCache,
    setIndexedCache: state.setIndexedCache,
    getIndexedCache: state.getIndexedCache,
    markStale: state.markStale,
    markManyStale: state.markManyStale,
    clearCache: state.clearCache,
    clearManyCache: state.clearManyCache,
    clearAllCache: state.clearAllCache,
    setBulkCache: state.setBulkCache,
    isCacheFresh: state.isCacheFresh,
  }));
}
