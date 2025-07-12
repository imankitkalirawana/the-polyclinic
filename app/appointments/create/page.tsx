import { auth } from '@/auth';
import CreateAppointment from '@/components/appointments/create';
import { allowedRolesToCreateAppointment } from '@/components/ui/calendar/data';
import { unauthorized } from 'next/navigation';

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
