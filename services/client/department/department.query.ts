import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DepartmentApi } from './department.api';
import { CreateDepartmentType, UpdateDepartmentType } from './department.types';
import { addToast } from '@heroui/react';

export const useAllDepartments = () =>
  useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const result = await DepartmentApi.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

export const useDepartmentByDid = (did?: string | null) =>
  useQuery({
    queryKey: ['department', did],
    queryFn: async () => {
      const result = await DepartmentApi.getByDid(did);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
    enabled: !!did,
  });

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDepartmentType) => {
      const result = await DepartmentApi.create({
        ...data,
        description: data.description || undefined,
        image: data.image || undefined,
        features: data.features || undefined,
      });
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      addToast({
        title: data.message || 'Department created successfully',
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

export const useUpdateDepartment = (did: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateDepartmentType) => {
      const result = await DepartmentApi.update(did, {
        ...data,
        description: data.description || undefined,
        image: data.image || undefined,
        features: data.features || undefined,
        status: data.status as 'active' | 'inactive' | undefined,
      });
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', did] });
      addToast({
        title: data.message || 'Department updated successfully',
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

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (did: string) => {
      const result = await DepartmentApi.delete(did);
      if (result.success) {
        return result;
      }
      throw new Error(result.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      addToast({
        title: data.message || 'Department deleted successfully',
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
