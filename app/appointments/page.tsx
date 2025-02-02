import { auth } from '@/auth';
import Appointments from '@/components/appointments';

export default async function Page() {
  const session = await auth();

  return <Appointments session={session} />;
}
