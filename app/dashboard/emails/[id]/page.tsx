import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import Email from '@/components/dashboard/emails/email';
import { getEmailWithID } from '@/functions/server-actions/emails';

interface Props {
  params: {
    id: string;
  };
}

const EmailPage = async ({ params }: Props) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['email', params.id],
    queryFn: () => getEmailWithID(params.id),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Email _id={params.id} />
      </HydrationBoundary>
    </>
  );
};

export default EmailPage;
