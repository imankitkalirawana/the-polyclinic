import { CreateUser, UpdateUser } from './user.types';
import { User } from './user.api';
import { useGenericMutation } from '@/services/useGenericMutation';
import { useGenericQuery } from '@/services/useGenericQuery';

export const useAllUsers = () =>
  useGenericQuery({
    queryKey: ['users'],
    queryFn: () => User.getAll(),
  });

export const useSelf = () =>
  useGenericQuery({
    queryKey: ['self'],
    queryFn: () => User.getSelf(),
  });

export const useLinkedUsers = () =>
  useGenericQuery({
    queryKey: ['linked-users'],
    queryFn: () => User.getLinked(),
  });

export const useUserWithID = (id?: string) =>
  useGenericQuery({
    queryKey: ['user', id],
    queryFn: () => User.getByID(id),
    enabled: !!id,
  });

export const useCreateUser = () => {
  return useGenericMutation({
    mutationFn: (user: CreateUser) => User.create(user),
    invalidateAllQueries: true,
  });
};

export const useUpdateUser = () => {
  return useGenericMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUser }) => User.update(id, data),
    invalidateAllQueries: true,
  });
};

export const useDeleteUser = () => {
  return useGenericMutation({
    mutationFn: (id: string) => User.delete(id),
    invalidateAllQueries: true,
  });
};
