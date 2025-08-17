import { unauthorized } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/auth';
import NewService from '@/components/dashboard/services/new';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const allowed = ['admin'];

  if (session?.user && !allowed.includes(session?.user?.role)) {
    unauthorized();
  }

  return (
    <div className="h-full w-full max-w-8xl px-2">
      <NewService />
    </div>
  );
}
