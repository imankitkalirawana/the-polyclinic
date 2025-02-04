import { auth } from '@/auth';
import Appointments from '@/components/appointments';
import UseRedirect from '@/hooks/useRedirect';

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <UseRedirect />;
  }

  return <Appointments session={session} />;
}
