import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { NewsletterType } from '@/types/newsletter';

import { getAllNewsletters } from './api/newsletter';

export const useAllNewsletters = (): UseQueryResult<NewsletterType[]> => {
  return useQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      const res = await getAllNewsletters();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });
};
