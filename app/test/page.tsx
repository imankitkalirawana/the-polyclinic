import { auth } from '@/auth';
import TanStackTable from '@/components/test/tanstack-table';
import { unauthorized } from 'next/navigation';

export default async function TestPage() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  return <TanStackTable />;
}
