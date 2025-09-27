import { useQuery } from '@tanstack/react-query';
import { Patient } from './api';

export const useAllPatients = () =>
  useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await Patient.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const usePatientByUID = (uid?: string | null) =>
  useQuery({
    queryKey: ['patient', uid],
    queryFn: async () => {
      const res = await Patient.getByUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });

export const usePreviousAppointments = (uid?: string | null) =>
  useQuery({
    queryKey: ['previous-appointments', uid],
    queryFn: async () => {
      const res = await Patient.getPreviousAppointments(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });
