import { useQuery } from '@tanstack/react-query';

import { getAllNewsletters } from './newsletter.api';

export const useAllNewsletters = () =>
  useQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      const result = await getAllNewsletters();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.message);
    },
  });
