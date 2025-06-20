import { getLinkedUsers, getSelf } from '@/services/api/user';
import { UserType } from '@/types/user';
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
    staleTime: 1000 * 60 * 5,
  });
};
