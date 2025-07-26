import { addToast } from '@heroui/react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

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

import { ApiResponse } from './api';

/**
 * GET request hooks
 *
 * The following hooks handle fetching user data from the API:
 * - useSelf: Fetches the current authenticated user
 * - useLinkedUsers: Fetches users linked to the current user
 * - useUserWithUID: Fetches a specific user by UID
 * - useAllUsers: Fetches all users
 * - useAllDoctors: Fetches all doctors
 */

export const useSelf = (): UseQueryResult<UserType> => {
  return useQuery({
    queryKey: ['self'],
    queryFn: async () => {
      const res = await getSelf();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

export const useLinkedUsers = (): UseQueryResult<UserType[]> => {
  return useQuery({
    queryKey: ['linked-users'],
    queryFn: async () => {
      const res = await getLinkedUsers();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

export const useUserWithUID = (uid: number): UseQueryResult<UserType> => {
  return useQuery({
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
};

export const useAllUsers = (): UseQueryResult<UserType[]> => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await getAllUsers();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};

/**
 * POST request hooks
 *
 * The following hooks handle creating user data from the API:
 * - useCreateUser: Creates a new user
 */

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

export const useUpdateUser = (): UseMutationResult<
  ApiResponse<UserType>,
  Error,
  UserType
> => {
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

// DELETE
export const useDeleteUser = (): UseMutationResult<
  ApiResponse<UserType>,
  Error,
  number
> => {
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
