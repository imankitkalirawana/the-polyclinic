import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getAllEmails, getEmailWithID } from '../../../services/api/client/email';

import { EmailType } from '@/types/client/email';

export const useAllEmails = (): UseQueryResult<EmailType[]> =>
  useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const res = await getAllEmails();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

export const useEmailWithID = (id: string): UseQueryResult<EmailType> =>
  useQuery({
    queryKey: ['email', id],
    queryFn: async () => {
      const res = await getEmailWithID(id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
