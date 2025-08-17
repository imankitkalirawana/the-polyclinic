import { unauthorized } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/auth';
import CreateAppointment from '@/components/appointments/create';

export default async function CreateAppointmentPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const allowedRoles = ['admin', 'receptionist', 'doctor', 'patient'];

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    return unauthorized();
  }

  return <CreateAppointment />;
}
