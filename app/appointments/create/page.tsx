import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/lib/serverAuth';
import CreateAppointment from '@/components/client/appointments/create';

export default async function CreateAppointmentPage() {
  const session = await getServerSession();
  const allowedRoles = ['admin', 'receptionist', 'doctor', 'user'];

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    return unauthorized();
  }

  return <CreateAppointment />;
}
