import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import Email from '@/components/dashboard/emails/email';
import { getEmailWithID } from '@/services/api/email';

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['email', params.id],
    queryFn: async () => {
      const res = await getEmailWithID(params.id);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Email id={params.id} />
      </HydrationBoundary>
    </>
  );
}
