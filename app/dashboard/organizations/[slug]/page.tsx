import { auth } from '@/auth';
import Organization from '@/components/dashboard/organizations/slug';
import { headers } from 'next/headers';

interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log('session', session);

  return <Organization slug={slug} />;
}
