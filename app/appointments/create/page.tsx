import { unauthorized } from 'next/navigation';

import { auth } from '@/auth';
import CreateAppointment from '@/components/client/appointments/create';

export default async function CreateAppointmentPage() {
  const session = await auth();
  const allowedRoles = ['admin', 'receptionist', 'doctor', 'user'];

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    return unauthorized();
  }

  return <CreateAppointment />;
}
