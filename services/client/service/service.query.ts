import { addToast } from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ServiceApi } from '@/services/client/service/service.api';
import { ServiceType } from '@/services/client/service/service.types';

export const useAllServices = () =>
  useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const result = await ServiceApi.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

export const useServiceWithUID = (uid: string) =>
  useQuery({
    queryKey: ['service', uid],
    queryFn: async () => {
      const result = await ServiceApi.getByUID(uid);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!uid,
  });

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ServiceType) => {
      const result = await ServiceApi.create(data);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
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

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ServiceType) => {
      const result = await ServiceApi.update(data.uniqueId, data);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['service', data.data?.uniqueId],
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

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid: string) => {
      const result = await ServiceApi.delete(uid);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
