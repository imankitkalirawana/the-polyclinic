import { HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getUserWithUID } from '@/services/api/user';

export default async function Layout(
  props: {
    params: Promise<{ uid: number }>;
    children: React.ReactNode;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', params.uid],
    queryFn: () => getUserWithUID(params.uid),
  });
  return <HydrationBoundary>{children}</HydrationBoundary>;
}
