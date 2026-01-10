import { DepartmentApi } from './department.api';
import { CreateDepartmentType, UpdateDepartmentType } from './department.types';
import { useGenericQuery } from '@/services/useGenericQuery';
import { useGenericMutation } from '@/services/useGenericMutation';

export const useAllDepartments = () =>
  useGenericQuery({
    queryKey: ['departments'],
    queryFn: () => DepartmentApi.getAll(),
  });

export const useDepartmentByDid = (did?: string | null) =>
  useGenericQuery({
    queryKey: ['department', did],
    queryFn: () => DepartmentApi.getByDid(did),
    enabled: !!did,
  });

export const useCreateDepartment = () => {
  return useGenericMutation({
    mutationFn: (data: CreateDepartmentType) => DepartmentApi.create(data),
    invalidateQueries: [['departments'], ['department']],
  });
};

export const useUpdateDepartment = (did: string) => {
  return useGenericMutation({
    mutationFn: (data: UpdateDepartmentType) => DepartmentApi.update(did, data),
    invalidateQueries: [['departments'], ['department', did]],
  });
};

export const useDeleteDepartment = () => {
  return useGenericMutation({
    mutationFn: (did: string) => DepartmentApi.delete(did),
    invalidateQueries: [['departments']],
  });
};
