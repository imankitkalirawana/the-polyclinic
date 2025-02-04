import Emails from '@/components/dashboard/emails';
import { getAllEmails } from '@/functions/server-actions/emails';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['emails'],
    queryFn: () => getAllEmails()
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Emails />
      </HydrationBoundary>
    </>
  );
}
