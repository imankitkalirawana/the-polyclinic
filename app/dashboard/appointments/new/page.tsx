import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/libs/serverAuth';
import NewAppointment from '@/components/dashboard/appointments/create';
import { UserRole } from '@/shared';

export default async function NewAppointmentPage() {
  const session = await getServerSession();
  const ALLOWED_ROLES: UserRole[] = [
    UserRole.ADMIN,
    UserRole.RECEPTIONIST,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ];

  if (!session?.user || !ALLOWED_ROLES.includes(session.user?.role)) {
    return unauthorized();
  }

  return <NewAppointment />;
}
