import AcceptInvitation from '@/components/accept-invitation';
import { getInvitation } from '@/services/api/organization';
import { QueryClient } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';

interface AcceptInvitationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AcceptInvitationPage({ params }: AcceptInvitationPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['invitation', id],
    queryFn: () => getInvitation({ id }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AcceptInvitation id={id} />
    </HydrationBoundary>
  );
}
