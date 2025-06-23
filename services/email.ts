import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAllEmails } from './api/email';
import { EmailType } from '@/types/email';

export const useAllEmails = (): UseQueryResult<EmailType[]> => {
  return useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const res = await getAllEmails();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};
