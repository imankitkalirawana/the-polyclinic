import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createPatient,
  getAllPatients,
  getPatientsWithPagination,
  getPreviousAppointments,
} from '../../../services/api/client/patient';
import { useInfiniteQueryWithSearch } from './infinite-query';
import { UserType } from '@/types/system/control-plane';
import { AppointmentType } from '@/types/client/appointment';
import { NewPatientFormValues } from '@/types/client/patient';
import { ApiResponse } from '../../../services/api';
import { addToast } from '@heroui/react';

export const useAllPatients = (): UseQueryResult<UserType[]> =>
  useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await getAllPatients();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const usePatientsInfiniteQuery = (search: string = '') => {
  return useInfiniteQueryWithSearch({
    queryKey: ['patients-infinite'],
    queryFn: getPatientsWithPagination,
    search: search.trim(),
    options: {
      limit: 5,
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: true,
    },
  });
};

export const usePreviousAppointments = (uid: number): UseQueryResult<AppointmentType[]> =>
  useQuery({
    queryKey: ['previous-appointments', uid],
    queryFn: async () => {
      const res = await getPreviousAppointments(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });

export const useCreatePatient = (): UseMutationResult<
  ApiResponse<UserType>,
  Error,
  NewPatientFormValues
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patient: NewPatientFormValues) => {
      const res = await createPatient(patient);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data: ApiResponse<UserType>) => {
      addToast({
        title: data.message,
        color: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patients-infinite'] });
    },
    onError: (error: Error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};
