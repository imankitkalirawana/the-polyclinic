import { useCacheStore } from './cache.store';
import { PatientType } from '@/services/client/patient';
import { DoctorType } from '@/services/client/doctor';

/**
 * Select the currently selected patient
 */
export function useSelectedPatient(): PatientType | null {
  return useCacheStore((state) => state.cache.selectedPatient);
}

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
