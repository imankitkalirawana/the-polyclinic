import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getAllEmails } from './helper';
import Emails from '@/components/dashboard/emails';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['emails'],
    queryFn: () => getAllEmails(),
    initialData: [],
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Emails />
      </HydrationBoundary>
    </>
  );
}
