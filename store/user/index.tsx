import { getLinkedUsers, getSelf } from '@/functions/server-actions/user';
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
