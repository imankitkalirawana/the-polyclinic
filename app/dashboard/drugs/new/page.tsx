import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/libs/serverAuth';
import { UserRole } from '@/shared';

export default async function Page() {
  const session = await getServerSession();
  const ALLOWED_ROLES: UserRole[] = [UserRole.ADMIN];

  if (!session?.user || !ALLOWED_ROLES.includes(session.user?.role)) {
    unauthorized();
  }

  return <div className="max-w-8xl h-full w-full px-2">adfa</div>;
}
