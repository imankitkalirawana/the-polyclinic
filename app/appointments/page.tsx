import { auth } from '@/auth';
import Appointments from '@/components/appointments';

export default async function Page() {
  const session = await auth();

  return (
    <div className="mx-auto mt-24 max-w-8xl px-4 md:px-8 lg:px-12">
      <Appointments session={session} />
    </div>
  );
}
