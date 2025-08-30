import { addToast } from '@heroui/react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { ApiResponse } from '../../fetch';

import { getLinkedUsers, getSelf, getUserWithUID } from '@/services/api/client/user';
import { CreateUser, SystemUser, UnifiedUser, UpdateUser, User } from '@/services/common/user';

export const useAllUsers = (): UseQueryResult<UnifiedUser[]> =>
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

export const useCreateUser = (): UseMutationResult<ApiResponse<UnifiedUser>, Error, CreateUser> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: CreateUser) => {
      const res = await User.create(user);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data) => {
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

export const useUpdateUser = (): UseMutationResult<
  ApiResponse<UnifiedUser>,
  Error,
  { uid: string; data: UpdateUser }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, data }: { uid: string; data: UpdateUser }) => {
      const res = await User.update(uid, data);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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

export const useDeleteUser = (): UseMutationResult<ApiResponse, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid: string) => {
      const res = await User.delete(uid);
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
