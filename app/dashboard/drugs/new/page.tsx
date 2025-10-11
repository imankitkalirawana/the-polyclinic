import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/lib/serverAuth';
import { ORGANIZATION_USER_ROLES, OrganizationUser } from '@/services/common/user';

export default async function Page() {
  const session = await getServerSession();
  const ALLOWED_ROLES: OrganizationUser['role'][] = [ORGANIZATION_USER_ROLES.admin];

  if (!session || !ALLOWED_ROLES.includes(session.user?.role as OrganizationUser['role'])) {
    unauthorized();
  }

  return <div className="h-full w-full max-w-8xl px-2">adfa</div>;
}
