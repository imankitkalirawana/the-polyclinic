import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Doctor } from './api';

import { DoctorType } from './types';

export const useAllDoctors = (): UseQueryResult<DoctorType[]> =>
  useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await Doctor.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useDoctorByUID = (uid?: string | null): UseQueryResult<DoctorType | null> =>
  useQuery({
    queryKey: ['doctor', uid],
    queryFn: async () => {
      const res = await Doctor.getByUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });
