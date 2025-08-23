'use client';
import { authClient } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';

interface OrganizationProps {
  slug: string;
}

export default function Organization({ slug }: OrganizationProps) {
  const { data } = useQuery({
    queryKey: ['organization', slug],
    queryFn: async () =>
      await authClient.organization.getFullOrganization({
        query: {
          organizationSlug: slug,
          membersLimit: 100,
        },
      }),
  });
  console.log(data);

  return <div>Hello</div>;
}
