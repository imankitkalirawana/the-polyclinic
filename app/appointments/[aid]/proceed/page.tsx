import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Appointment from '@/components/appointments/id';
import { getAppointmentWithAID } from '@/functions/server-actions/appointment';

interface Props {
  params: {
    aid: number;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['appointment', params.aid],
    queryFn: () => getAppointmentWithAID(params.aid),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Appointment aid={params.aid} />
      </HydrationBoundary>
    </>
  );
}
