import { addToast } from '@heroui/react';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { ApiResponse } from '@/services/fetch';

import { CreateUser, UnifiedUser, UpdateUser, User } from '@/services/common/user';

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

export const useSelf = (): UseQueryResult<UnifiedUser> =>
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

export const useLinkedUsers = (): UseQueryResult<UnifiedUser[]> =>
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

export const useUserWithUID = (uid?: string): UseQueryResult<UnifiedUser | null> =>
  useQuery({
    queryKey: ['user', uid],
    queryFn: async () => {
      const res = await User.getByUID(uid);
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
      const error = new Error();
      error.name = res.message;
      error.message = res.errors?.join(', ') || res.message;
      throw error;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.organization] });

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

export const useDeleteUser = (): UseMutationResult<
  ApiResponse,
  Error,
  {
    uid: string;
    organization?: string | null;
  }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, organization }) => {
      const res = await User.delete(uid, organization);
      if (res.success) {
        return res;
      }
      throw new Error(res.message);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.organization] });
      addToast({
        title: 'User deleted successfully',
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
