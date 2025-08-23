'use client';
import { authClient } from '@/lib/auth-client';
import { Button } from '@heroui/react';

export default function Organizations() {
  const metadata = { someKey: 'someValue' };
  const { data: organizations } = authClient.useListOrganizations();

  const handleCreateOrganization = async () => {
    await authClient.organization.create({
      name: 'My Organization', // required
      slug: 'my-org-2', // required
      logo: 'https://example.com/logo.png',
      metadata,
      keepCurrentActiveOrganization: false,
    });
  };

  return (
    <div>
      <Button onPress={handleCreateOrganization}>Create Organization</Button>
      {organizations?.map((organization) => <div key={organization.id}>{organization.name}</div>)}
    </div>
  );
}
