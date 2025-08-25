import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getAllNewsletters } from '../../../services/api/client/newsletter';

import { NewsletterType } from '@/types/newsletter';

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
