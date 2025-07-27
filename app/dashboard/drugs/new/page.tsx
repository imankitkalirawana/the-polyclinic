import { unauthorized } from 'next/navigation';

import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  const allowedRoles = ['admin'];

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    unauthorized();
  }

  return <div className="h-full w-full max-w-8xl px-2">adfa</div>;
}
