import { CreateUser, UpdateUser } from './user.types';
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

export const useCreateUser = () => {
  return useGenericMutation({
    mutationFn: (user: CreateUser) => UserApi.create(user),
    invalidateAllQueries: true,
  });
};

export const useUpdateUser = () => {
  return useGenericMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUser }) => UserApi.update(id, data),
    invalidateAllQueries: true,
  });
};

export const useDeleteUser = () => {
  return useGenericMutation({
    mutationFn: (id: string) => UserApi.delete(id),
    invalidateAllQueries: true,
  });
};
