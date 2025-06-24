import { HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getUserWithUID } from '@/services/api/user';

export default async function Layout({
  params,
  children,
}: {
  params: { uid: number };
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', params.uid],
    queryFn: () => getUserWithUID(params.uid),
  });
  return <HydrationBoundary>{children}</HydrationBoundary>;
}
