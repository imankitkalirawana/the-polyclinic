import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Patient } from './api';
import { PatientType } from './types';
import { AppointmentType } from '../appointment';

export const useAllPatients = (): UseQueryResult<PatientType[]> =>
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

export const usePatientByUID = (uid?: string | null): UseQueryResult<PatientType | null> =>
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

export const usePreviousAppointments = (
  uid?: string | null
): UseQueryResult<AppointmentType[] | null> =>
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
