import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiResponse } from './api';
import { CreateDoctorType, DoctorType } from '@/types/doctor';
import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  getDoctors,
} from './api/doctor';
import { addToast } from '@heroui/react';

export const useAllDoctors = (): UseQueryResult<DoctorType[]> => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await getDoctors();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

export const useDoctor = (uid: number): UseQueryResult<DoctorType> => {
  return useQuery({
    queryKey: ['doctor', uid],
    queryFn: async () => {
      const res = await getDoctor(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

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

export const useDeleteDoctor = (): UseMutationResult<
  ApiResponse<DoctorType>,
  Error,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid: number) => {
      const res = await deleteDoctor(uid);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: () => {
      console.log('invalidating doctors');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });
};
