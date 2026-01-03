import { useQuery } from '@tanstack/react-query';
import { PatientApi } from './patient.api';

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
