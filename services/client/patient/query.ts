import { useQuery } from '@tanstack/react-query';
import { Patient } from './api';

export const useAllPatients = () =>
  useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const result = await Patient.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

export const usePatientByUID = (uid?: string | null) =>
  useQuery({
    queryKey: ['patient', uid],
    queryFn: async () => {
      const result = await Patient.getByUID(uid);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!uid,
  });

export const usePreviousAppointments = (uid?: string | null) =>
  useQuery({
    queryKey: ['previous-appointments', uid],
    queryFn: async () => {
      const result = await Patient.getPreviousAppointments(uid);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!uid,
  });
