import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getAllNewsletters } from './api/newsletter';
import { NewsletterType } from '@/types/newsletter';

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
