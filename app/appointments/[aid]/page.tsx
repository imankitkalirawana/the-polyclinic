import { auth } from '@/auth';
import Appointment from '@/components/appointments/id';
import { getAppointmentWithAID } from '@/functions/server-actions/appointment';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

interface Props {
  params: Promise<{
    aid: number;
  }>;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['appointment', params.aid],
    queryFn: () => getAppointmentWithAID(params.aid)
  });

  const session = await auth();

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Appointment aid={params.aid} session={session} />
      </HydrationBoundary>
    </>
  );
}
