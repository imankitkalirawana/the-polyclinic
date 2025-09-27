import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/lib/serverAuth';

export default async function Page() {
  const session = await getServerSession();
  const allowedRoles = ['admin'];

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    unauthorized();
  }

  return <div className="h-full w-full max-w-8xl px-2">adfa</div>;
}
