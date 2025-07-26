import { unauthorized } from 'next/navigation';

import { auth } from '@/auth';
import TanStackTable from '@/components/test/tanstack-table';

export default async function TestPage() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  return <TanStackTable />;
}
