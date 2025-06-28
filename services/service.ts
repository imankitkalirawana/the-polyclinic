import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createService,
  deleteService,
  getAllServices,
  getServiceWithUID,
  updateService,
} from './api/service';
import { ServiceType } from '@/types/service';
import { ApiResponse } from './api';
import { addToast } from '@heroui/react';

export const useAllServices = (): UseQueryResult<ServiceType[]> => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await getAllServices();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

export const useServiceWithUID = (uid: string): UseQueryResult<ServiceType> => {
  return useQuery({
    queryKey: ['service', uid],
    queryFn: async () => {
      const res = await getServiceWithUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });
};

export const useCreateService = (): UseMutationResult<
  ApiResponse<ServiceType>,
  Error,
  ServiceType
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ServiceType) => {
      const res = await createService(data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      addToast({
        title: data.message,
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};

export const useUpdateService = (): UseMutationResult<
  ApiResponse<ServiceType>,
  Error,
  ServiceType
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ServiceType) => {
      const res = await updateService(data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['service', data.data.uniqueId],
      });
      addToast({
        title: data.message,
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};

export const useDeleteService = (): UseMutationResult<
  ApiResponse<ServiceType>,
  Error,
  string
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid: string) => {
      const res = await deleteService(uid);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
