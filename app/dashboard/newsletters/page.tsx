import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import Newsletters from '@/components/dashboard/newsletters/newsletters';
import { getAllNewsletters } from '@/functions/server-actions/newsletters';

const NewslettersPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['newsletters'],
    queryFn: () => getAllNewsletters(),
    initialData: [],
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Newsletters />
      </HydrationBoundary>
    </>
  );
};

export default NewslettersPage;
