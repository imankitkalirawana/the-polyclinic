import { addToast } from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CreateUser, UpdateUser } from './user.types';
import { User } from './user.api';
import { useGenericMutation } from '@/services/useGenericMutation';

export const useAllUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await User.getAll();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useSelf = () =>
  useQuery({
    queryKey: ['self'],
    queryFn: async () => {
      const res = await User.getSelf();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useLinkedUsers = () =>
  useQuery({
    queryKey: ['linked-users'],
    queryFn: async () => {
      const res = await User.getLinked();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useUserWithID = (id?: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await User.getByID(id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!id,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: CreateUser) => {
      const res = await User.create(user);
      if (res.success) {
        return res;
      }
      const error = new Error();
      error.name = res.message;
      error.message = res.errors?.join(', ') || res.message;
      throw error;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();

      addToast({
        title: data.message,
        color: 'success',
      });
    },
    onError: (error) => {
      addToast({
        title: error.name,
        description: error.message,
        color: 'danger',
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUser }) => {
      const res = await User.update(id, data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.data.organization] });
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

export const useDeleteUser = () => {
  return useGenericMutation({
    mutationFn: (id: string) => User.delete(id),
    invalidateQueries: [],
  });
};
