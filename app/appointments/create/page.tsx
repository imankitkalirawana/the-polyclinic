import { unauthorized } from 'next/navigation';

import { auth } from '@/auth';
import CreateAppointment from '@/components/appointments/create';
import { allowedRolesToCreateAppointment } from '@/components/ui/calendar/data';

export default async function CreateAppointmentPage() {
  const session = await auth();
  const isAllowedToCreateAppointment = allowedRolesToCreateAppointment.includes(
    session?.user?.role
  );

  if (!isAllowedToCreateAppointment) {
    return unauthorized();
  }

  return <CreateAppointment />;
}
