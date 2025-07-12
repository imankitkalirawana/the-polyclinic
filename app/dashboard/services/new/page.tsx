import { auth } from '@/auth';
import NewService from '@/components/dashboard/services/new';
import { unauthorized } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  const allowed = ['admin'];

  if (!session || !allowed.includes(session?.user?.role)) {
    unauthorized();
  }

  return (
    <div className="h-full w-full max-w-8xl px-2">
      <NewService />
    </div>
  );
}
