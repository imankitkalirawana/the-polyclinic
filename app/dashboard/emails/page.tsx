import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import Emails from '@/components/dashboard/emails';
import { getAllEmails } from '@/services/client/email/email.api';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const res = await getAllEmails();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
    initialData: [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Emails />
    </HydrationBoundary>
  );
}
