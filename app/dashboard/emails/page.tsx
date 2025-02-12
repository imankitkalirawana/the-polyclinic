import { auth } from '@/auth';
import Emails from '@/components/dashboard/emails';

export default async function Page() {
  const session = await auth();

  return (
    <>
      <Emails session={session} />
    </>
  );
}
