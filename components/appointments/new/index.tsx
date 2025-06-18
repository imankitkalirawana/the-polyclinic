import { auth } from '@/auth';
import NoSession from './no-session';
import Session from './session';

export default async function NewAppointment() {
  const session = await auth();

  if (!session) {
    return <NoSession />;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Session session={session} />
    </div>
  );
}
