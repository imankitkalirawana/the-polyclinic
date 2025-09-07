import { notFound } from 'next/navigation';
import { excludedSubdomains } from '@/lib/utils';

const subdomains = ['fortis', 'clinic'];

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  if (!subdomains.includes(subdomain) || excludedSubdomains.includes(subdomain)) {
    notFound();
  }

  return <div>Subdomain: {subdomain}</div>;
}
