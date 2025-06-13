import { getLinkedUsers, getSelf } from '@/services/api/user';
import { UserType } from '@/models/User';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useSelf = (): UseQueryResult<UserType> => {
  return useQuery({
    queryKey: ['self'],
    queryFn: () => getSelf(),
  });
};

export const useLinkedUsers = (): UseQueryResult<Array<UserType>> => {
  return useQuery({
    queryKey: ['linkedUsers'],
    queryFn: () => getLinkedUsers(),
  });
};
