import { addToast } from '@heroui/react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { ServiceApi } from '@/services/client/service/api';
import { ServiceType } from '@/services/client/service/types';
import { ApiResponse } from '@/services/fetch';

export const useAllServices = (): UseQueryResult<ServiceType[]> =>
  useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await ServiceApi.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useServiceWithUID = (uid: string): UseQueryResult<ServiceType | null> =>
  useQuery({
    queryKey: ['service', uid],
    queryFn: async () => {
      const res = await ServiceApi.getByUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });

export const useCreateService = (): UseMutationResult<
  ApiResponse<ServiceType>,
  Error,
  ServiceType
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ServiceType) => {
      const res = await ServiceApi.create(data);
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
      const res = await ServiceApi.update(data.uniqueId, data);
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

export const useDeleteService = (): UseMutationResult<ApiResponse<ServiceType>, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid: string) => {
      const res = await ServiceApi.delete(uid);
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
