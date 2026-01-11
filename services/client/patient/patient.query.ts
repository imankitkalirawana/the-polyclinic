import { PatientApi } from './patient.api';
import { useGenericQuery } from '@/services/useGenericQuery';

export const useAllPatients = (search?: string) =>
  useGenericQuery({
    queryKey: ['patients', search],
    queryFn: () => PatientApi.getAll(search),
  });

export const usePatientById = (id?: string | null) =>
  useGenericQuery({
    queryKey: ['patient', id],
    queryFn: () => PatientApi.getById(id),
    enabled: !!id,
  });

export const usePreviousAppointments = (uid?: string | null) =>
  useGenericQuery({
    queryKey: ['previous-appointments', uid],
    queryFn: () => PatientApi.getPreviousAppointments(uid),
    enabled: !!uid,
  });
