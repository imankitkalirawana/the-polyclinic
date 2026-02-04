import { $FixMe } from '@/types';
import { ResetPasswordRequest, UserFormValues } from './user.types';
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

export const useResetPassword = () =>
  useGenericMutation({
    mutationFn: ({ id, data }: { id: string; data: ResetPasswordRequest }) =>
      UserApi.resetPassword(id, data),
  });

export const useUserWithID = (id?: string | null) =>
  useGenericQuery({
    queryKey: ['user', id],
    queryFn: () => UserApi.getByID(id),
    enabled: !!id,
  });

export const useUserProfileByID = (id?: string | null) =>
  useGenericQuery({
    queryKey: ['user-profile', id],
    queryFn: () => UserApi.getUserProfile(id),
    enabled: !!id,
  });

export const useCreateUser = ({ showToast = true }: { showToast?: boolean } = {}) => {
  return useGenericMutation({
    mutationFn: (data: UserFormValues) => UserApi.create(data),
    invalidateAllQueries: true,
    showToast,
  });
};

export const useUpdateUser = () => {
  return useGenericMutation({
    mutationFn: ({ id, data }: { id: string; data: $FixMe }) => UserApi.update(id, data),
    invalidateAllQueries: true,
  });
};

export const useDeleteUser = () => {
  return useGenericMutation({
    mutationFn: (id: string) => UserApi.delete(id),
    invalidateAllQueries: true,
  });
};
