import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/libs/serverAuth';
import { UserRole } from '@/shared';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const ALLOWED_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR];

  if (!session) {
    unauthorized();
  }

  if (session?.user?.role && !ALLOWED_ROLES.includes(session?.user?.role)) {
    unauthorized();
  }

  return children;
}
