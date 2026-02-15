import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/libs/serverAuth';
import { Role } from '@/services/common/user/user.constants';

export default async function Page() {
  const session = await getServerSession();
  const ALLOWED_ROLES: Role[] = [Role.ADMIN];

  if (!session?.user || !ALLOWED_ROLES.includes(session.user?.role)) {
    unauthorized();
  }

  return <div className="h-full w-full max-w-8xl px-2">adfa</div>;
}
