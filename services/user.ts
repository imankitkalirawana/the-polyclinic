import {
  getAllUsers,
  getLinkedUsers,
  getSelf,
  getUserWithUID,
} from '@/services/api/user';
import { UserType } from '@/types/user';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

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
