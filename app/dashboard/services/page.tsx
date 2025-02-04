import Services from '@/components/dashboard/services';
import { getAllServices } from '@/functions/server-actions/services';
import { API_BASE_URL } from '@/lib/config';
import { ServiceType } from '@/models/Service';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import axios from 'axios';
import { cookies } from 'next/headers';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['services'],
    queryFn: () => getAllServices()
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Services />
      </HydrationBoundary>
    </>
  );
}
