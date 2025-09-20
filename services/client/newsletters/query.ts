import { useQuery } from '@tanstack/react-query';

import { getAllNewsletters } from './api';

export const useAllNewsletters = () =>
  useQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      const res = await getAllNewsletters();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
