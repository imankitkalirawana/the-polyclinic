import Organization from '@/components/dashboard/organizations/slug';
import { getFullOrganization } from '@/services/api/organization';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { slug } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['organization', slug],
    queryFn: () => getFullOrganization({ organizationSlug: slug }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Organization slug={slug} />
    </HydrationBoundary>
  );
}
