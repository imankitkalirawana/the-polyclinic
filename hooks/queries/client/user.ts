import { addToast } from '@heroui/react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { ApiResponse } from '../../../services/fetch';

import {
  createUser,
  deleteUser,
  getAllUsers,
  getLinkedUsers,
  getSelf,
  getUserWithUID,
  updateUser,
} from '@/services/api/client/user';
import { $FixMe } from '@/types';
import { CreateUser, SystemUser } from '@/services/common/user';

export const useSelf = (): UseQueryResult<SystemUser> =>
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

export const useLinkedUsers = (): UseQueryResult<SystemUser[]> =>
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

export const useUserWithUID = (uid: string | undefined): UseQueryResult<SystemUser> =>
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

export const useAllUsers = (): UseQueryResult<SystemUser[]> =>
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

export const useCreateUser = (): UseMutationResult<ApiResponse<SystemUser>, Error, CreateUser> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: CreateUser) => {
      const res = await createUser(user);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data: ApiResponse<SystemUser>) => {
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

export const useUpdateUser = (): UseMutationResult<ApiResponse<SystemUser>, Error, SystemUser> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: SystemUser) => {
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

export const useDeleteUser = (): UseMutationResult<ApiResponse<SystemUser>, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid: string) => {
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
