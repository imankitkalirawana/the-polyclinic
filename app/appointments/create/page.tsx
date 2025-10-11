import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/lib/serverAuth';
import CreateAppointment from '@/components/client/appointments/create';
import { ORGANIZATION_USER_ROLES, OrganizationUser } from '@/services/common/user';

export default async function CreateAppointmentPage() {
  const session = await getServerSession();
  const ALLOWED_ROLES: OrganizationUser['role'][] = [
    ORGANIZATION_USER_ROLES.admin,
    ORGANIZATION_USER_ROLES.receptionist,
    ORGANIZATION_USER_ROLES.doctor,
    ORGANIZATION_USER_ROLES.patient,
  ];

  if (!session || !ALLOWED_ROLES.includes(session.user?.role as OrganizationUser['role'])) {
    return unauthorized();
  }

  return <CreateAppointment />;
}
