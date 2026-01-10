import { PatientApi } from './patient.api';
import { useGenericMutation } from '@/services/useGenericMutation';
import { useGenericQuery } from '@/services/useGenericQuery';
import { NewPatientRequest } from './patient.types';

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

export const useCreatePatient = () =>
  useGenericMutation({
    mutationFn: (data: NewPatientRequest) => PatientApi.create(data),
    invalidateQueries: [['patients']],
  });
