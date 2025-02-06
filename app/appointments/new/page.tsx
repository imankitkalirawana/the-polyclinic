import { auth } from '@/auth';
import NewAppointment from '@/components/appointments/new';

export default async function Page() {
  const session = await auth();
  return <NewAppointment session={session} />;
}
