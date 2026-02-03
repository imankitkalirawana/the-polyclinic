import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/libs/serverAuth';
import NewAppointment from '@/components/dashboard/appointments/create';
import { Role } from '@/services/common/user/user.constants';

export default async function NewAppointmentPage() {
  const session = await getServerSession();
  const ALLOWED_ROLES: Role[] = [Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.PATIENT];

  if (!session?.user || !ALLOWED_ROLES.includes(session.user?.role)) {
    return unauthorized();
  }

  return <NewAppointment />;
}
