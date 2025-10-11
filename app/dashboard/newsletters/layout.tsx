import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/lib/serverAuth';
import { ORGANIZATION_USER_ROLES, OrganizationUser } from '@/services/common/user';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const ALLOWED_ROLES: OrganizationUser['role'][] = [
    ORGANIZATION_USER_ROLES.admin,
    ORGANIZATION_USER_ROLES.receptionist,
    ORGANIZATION_USER_ROLES.doctor,
  ];

  if (!session || !ALLOWED_ROLES.includes(session.user?.role as OrganizationUser['role'])) {
    unauthorized();
  }

  return children;
}
