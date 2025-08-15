import { addToast } from '@heroui/react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { ApiResponse } from './api';

import {
  createUser,
  deleteUser,
  getAllUsers,
  getLinkedUsers,
  getSelf,
  getUserWithUID,
  updateUser,
} from '@/services/api/user';
import { $FixMe } from '@/types';
import { CreateUserType, UserType } from '@/types/user';

export const useSelf = (): UseQueryResult<UserType> =>
  useQuery({
    queryKey: ['self'],
    queryFn: async () => {
      const res = await getSelf();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useLinkedUsers = (): UseQueryResult<UserType[]> =>
  useQuery({
    queryKey: ['linked-users'],
    queryFn: async () => {
      const res = await getLinkedUsers();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

/**
 * React Query hook to fetch a user by their unique ID.
 *
 * @param {number | undefined} uid - The unique identifier of the user.
 *   If `undefined`, the query will be disabled.
 */

export const useUserWithUID = (uid: number | undefined): UseQueryResult<UserType> =>
  useQuery({
    queryKey: ['user', uid],
    queryFn: async () => {
      const res = await getUserWithUID(uid);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    enabled: !!uid,
  });

export const useAllUsers = (): UseQueryResult<UserType[]> =>
  useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await getAllUsers();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useCreateUser = (): UseMutationResult<
  ApiResponse<UserType>,
  Error,
  CreateUserType
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: CreateUserType) => {
      const res = await createUser(user);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data: ApiResponse<UserType>) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addToast({
        title: data.message,
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

export const useUpdateUser = (): UseMutationResult<ApiResponse<UserType>, Error, UserType> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: UserType) => {
      const res = await updateUser(user);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data: $FixMe) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addToast({
        title: data.message,
        color: 'success',
      });
    },
    onError: (error: $FixMe) => {
      addToast({
        title: error.message,
        color: 'danger',
      });
    },
  });
};

export const useDeleteUser = (): UseMutationResult<ApiResponse<UserType>, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid: number) => {
      const res = await deleteUser(uid);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
