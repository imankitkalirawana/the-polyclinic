import { auth } from '@/auth';
import NewAppointment from '@/components/appointments/new';

export default async function Page() {
  const session = await auth();
  return (
    <div className="m-auto max-w-7xl">
      <NewAppointment session={session} />
    </div>
  );
}
