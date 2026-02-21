import { UserApi } from './user.api';
import { useGenericMutation } from '@/services/useGenericMutation';
import { useGenericQuery } from '@/services/useGenericQuery';
import { CreateProfileDto, ResetPasswordDto } from '@/shared';

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
    mutationFn: ({ id, data }: { id: string; data: ResetPasswordDto }) =>
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
    mutationFn: (data: CreateProfileDto) => UserApi.create(data),
    invalidateAllQueries: true,
    showToast,
  });
};

export const useUpdateUser = () => {
  return useGenericMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProfileDto }) => UserApi.update(id, data),
    invalidateAllQueries: true,
  });
};

export const useDeleteUser = () => {
  return useGenericMutation({
    mutationFn: (id: string) => UserApi.delete(id),
    invalidateAllQueries: true,
  });
};
