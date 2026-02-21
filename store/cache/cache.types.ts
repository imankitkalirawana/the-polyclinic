import { DoctorSpecialization, DoctorType } from '@/services/client/doctor';
import { DepartmentType } from '@/services/client/department/department.types';
import { ServiceType } from '@/services/client/service/service.types';
import { Appointment, Drug } from '@/shared';
import { AppointmentType } from '@/services/client/appointment/appointment.types';
import { AppointmentQueue, Patient, User } from '@/shared';

/**
 * Cache Registry - Central type definition for all cacheable entities
 *
 * To add a new cacheable entity:
 * 1. Add the type import above
 * 2. Add the key-type mapping to CacheRegistry
 *
 * The cache system will automatically infer types based on these mappings.
 */
export interface CacheRegistry {
  // Collections (arrays)
  patients: Patient[];
  doctors: DoctorType[];
  departments: DepartmentType[];
  services: ServiceType[];
  drugs: Drug[];
  appointments: Appointment[];
  appointmentQueues: AppointmentQueue[];
  users: User[];
  specializations: DoctorSpecialization[];
  // Single entities (for selections, current items, etc.)
  selectedPatient: Patient | null;
  selectedDoctor: DoctorType | null;
  selectedDepartment: DepartmentType | null;
  selectedService: ServiceType | null;
  selectedDrug: Drug | null;
  selectedAppointment: AppointmentType | null;
  selectedAppointmentQueue: AppointmentQueue | null;
  selectedUser: User | null;

  // Indexed entities (by ID)
  patientById: Record<string, Patient>;
  doctorById: Record<string, DoctorType>;
  departmentById: Record<string, DepartmentType>;
  serviceById: Record<string, ServiceType>;
  drugById: Record<string, Drug>;
  appointmentById: Record<string, AppointmentType>;
  appointmentQueueById: Record<string, AppointmentQueue>;
  userById: Record<string, User>;
}

/**
 * All valid cache keys
 */
export type CacheKey = keyof CacheRegistry;

/**
 * Get the type for a specific cache key
 */
export type CacheValue<K extends CacheKey> = CacheRegistry[K];

/**
 * Cache entry with metadata
 */
export interface CacheEntry<K extends CacheKey> {
  data: CacheRegistry[K];
  timestamp: number;
  stale: boolean;
}

/**
 * Configuration for cache behavior
 */
export interface CacheConfig {
  /** Time in milliseconds before cache is considered stale */
  staleTime?: number;
  /** Whether to persist this cache key to storage */
  persist?: boolean;
}

/**
 * Options for the useQueryWithCache hook
 */
export interface CacheOptions<K extends CacheKey> {
  /** The cache key to store the data under */
  cacheKey: K;
  /** Optional transform function to modify data before caching */
  transform?: (data: CacheRegistry[K]) => CacheRegistry[K];
  /** Cache configuration */
  config?: CacheConfig;
}

/**
 * Options for indexed cache (by ID)
 */
export interface IndexedCacheOptions<K extends CacheKey> {
  /** The cache key for the indexed store */
  indexKey: K;
  /** The ID of the entity being cached */
  entityId: string;
  /** Cache configuration */
  config?: CacheConfig;
}

/**
 * Type guard to check if a key is a valid cache key
 */
export function isCacheKey(key: string): key is CacheKey {
  const validKeys: CacheKey[] = [
    'patients',
    'doctors',
    'departments',
    'services',
    'drugs',
    'appointments',
    'appointmentQueues',
    'users',
    'selectedPatient',
    'selectedDoctor',
    'selectedDepartment',
    'selectedService',
    'selectedDrug',
    'selectedAppointment',
    'selectedAppointmentQueue',
    'selectedUser',
    'patientById',
    'doctorById',
    'departmentById',
    'serviceById',
    'drugById',
    'appointmentById',
    'appointmentQueueById',
    'userById',
  ];
  return validKeys.includes(key as CacheKey);
}

/**
 * Default values for each cache key (used for initialization)
 */
export const cacheDefaults: CacheRegistry = {
  patients: [],
  doctors: [],
  departments: [],
  services: [],
  drugs: [],
  appointments: [],
  appointmentQueues: [],
  users: [],
  specializations: [],
  selectedPatient: null,
  selectedDoctor: null,
  selectedDepartment: null,
  selectedService: null,
  selectedDrug: null,
  selectedAppointment: null,
  selectedAppointmentQueue: null,
  selectedUser: null,
  patientById: {},
  doctorById: {},
  departmentById: {},
  serviceById: {},
  drugById: {},
  appointmentById: {},
  appointmentQueueById: {},
  userById: {},
};
