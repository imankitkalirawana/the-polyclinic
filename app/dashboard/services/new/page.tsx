import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/lib/serverAuth';
import NewService from '@/components/dashboard/services/new';

export default async function Page() {
  const session = await getServerSession();
  const allowed = ['admin'];

  if (session?.user?.role && !allowed.includes(session?.user?.role)) {
    unauthorized();
  }

  return (
    <div className="h-full w-full max-w-8xl px-2">
      <NewService />
    </div>
  );
}
