import Email from '@/components/dashboard/emails/email';
import { getEmailWithID } from '@/functions/server-actions/emails';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['email', params.id],
    queryFn: () => getEmailWithID(params.id)
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Email _id={params.id} />
      </HydrationBoundary>
    </>
  );
}
