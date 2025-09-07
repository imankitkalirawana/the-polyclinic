import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getAllNewsletters } from './api';

import { NewsletterType } from '@/services/client/newsletters/types';

export const useAllNewsletters = (): UseQueryResult<NewsletterType[]> =>
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
