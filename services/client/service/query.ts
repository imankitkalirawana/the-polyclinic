import { addToast } from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ServiceApi } from '@/services/client/service/api';
import { ServiceType } from '@/services/client/service/types';

export const useAllServices = () =>
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

export const useServiceWithUID = (uid: string) =>
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

export const useCreateService = () => {
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

export const useUpdateService = () => {
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
