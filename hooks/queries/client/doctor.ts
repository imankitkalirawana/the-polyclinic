import { addToast } from '@heroui/react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  getDoctors,
} from '../../../services/api/client/doctor';
import { ApiResponse } from '../../../services/fetch';

import { CreateDoctorType, DoctorType } from '@/types/client/doctor';

export const useAllDoctors = (): UseQueryResult<DoctorType[]> =>
  useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await getDoctors();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useDoctorWithUID = (uid: string): UseQueryResult<DoctorType> =>
  useQuery({
    queryKey: ['doctor', uid],
    queryFn: async () => {
      const res = await getDoctor(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });

export const useCreateDoctor = (): UseMutationResult<
  ApiResponse<DoctorType>,
  Error,
  CreateDoctorType
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (doctor: CreateDoctorType) => {
      const res = await createDoctor(doctor);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data: ApiResponse<DoctorType>) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      addToast({
        title: data.message,
        color: 'success',
      });
    },
    onError: (error: Error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};

export const useDeleteDoctor = (): UseMutationResult<ApiResponse<DoctorType>, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid: string) => {
      const res = await deleteDoctor(uid);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};
