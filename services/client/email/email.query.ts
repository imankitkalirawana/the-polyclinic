import { useQuery } from '@tanstack/react-query';

import { getAllEmails, getEmailWithID } from './email.api';

export const useAllEmails = () =>
  useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const result = await getAllEmails();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });

export const useEmailWithID = (id: string) =>
  useQuery({
    queryKey: ['email', id],
    queryFn: async () => {
      const result = await getEmailWithID(id);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });
