import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/libs/serverAuth';
import { Role } from '@/services/common/user/user.constants';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const ALLOWED_ROLES: Role[] = [Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR];

  if (!session) {
    unauthorized();
  }

  if (session?.user?.role && !ALLOWED_ROLES.includes(session?.user?.role)) {
    unauthorized();
  }

  return children;
}
