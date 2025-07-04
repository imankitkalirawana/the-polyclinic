import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAllEmails, getEmailWithID } from './api/email';
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

export const useEmailWithID = (id: string): UseQueryResult<EmailType> => {
  return useQuery({
    queryKey: ['email', id],
    queryFn: async () => {
      const res = await getEmailWithID(id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};
