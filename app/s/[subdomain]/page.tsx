import { notFound } from 'next/navigation';
import { excludedSubdomains } from '@/lib/utils';

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  if (excludedSubdomains.includes(subdomain)) {
    notFound();
  }

  return <div>Subdomain: {subdomain}</div>;
}
