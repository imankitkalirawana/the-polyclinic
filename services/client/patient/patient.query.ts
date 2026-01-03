import { useQuery } from '@tanstack/react-query';
import { PatientApi } from './patient.api';
import { useGenericMutation } from '@/services/useGenericMutation';
import { NewPatientRequest } from './patient.types';

export const useAllPatients = (search?: string) =>
  useQuery({
    queryKey: ['patients', search],
    queryFn: async () => {
      const result = await PatientApi.getAll(search);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

export const usePatientById = (id?: string | null) =>
  useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const result = await PatientApi.getById(id);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!id,
  });

export const usePreviousAppointments = (uid?: string | null) =>
  useQuery({
    queryKey: ['previous-appointments', uid],
    queryFn: async () => {
      const result = await PatientApi.getPreviousAppointments(uid);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!uid,
  });

export const useCreatePatient = () =>
  useGenericMutation({
    mutationFn: async (data: NewPatientRequest) => {
      const result = await PatientApi.create(data);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    showToast: true,
    invalidateQueries: [['patients']],
  });
