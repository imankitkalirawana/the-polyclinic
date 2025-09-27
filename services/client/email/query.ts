import { useQuery } from '@tanstack/react-query';

import { getAllEmails, getEmailWithID } from './api';

export const useAllEmails = () =>
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

export const useEmailWithID = (id: string) =>
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
