import { CreateUserRequest, UpdateUserRequest } from './user.types';
import { UserApi } from './user.api';
import { useGenericMutation } from '@/services/useGenericMutation';
import { useGenericQuery } from '@/services/useGenericQuery';

export const useAllUsers = () =>
  useGenericQuery({
    queryKey: ['users'],
    queryFn: () => UserApi.getAll(),
  });

export const useSelf = () =>
  useGenericQuery({
    queryKey: ['self'],
    queryFn: () => UserApi.getSelf(),
  });

export const useLinkedUsers = () =>
  useGenericQuery({
    queryKey: ['linked-users'],
    queryFn: () => UserApi.getLinked(),
  });

export const useUserWithID = (id?: string) =>
  useGenericQuery({
    queryKey: ['user', id],
    queryFn: () => UserApi.getByID(id),
    enabled: !!id,
  });

export const useCreateUser = ({ showToast = true }: { showToast?: boolean } = {}) => {
  return useGenericMutation({
    mutationFn: (user: CreateUserRequest) => UserApi.create(user),
    invalidateAllQueries: true,
    showToast,
  });
};

export const useUpdateUser = () => {
  return useGenericMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => UserApi.update(id, data),
    invalidateAllQueries: true,
  });
};

export const useDeleteUser = () => {
  return useGenericMutation({
    mutationFn: (id: string) => UserApi.delete(id),
    invalidateAllQueries: true,
  });
};
