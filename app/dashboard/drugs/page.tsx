import { auth } from '@/auth';
import Drugs from '@/components/dashboard/drugs';

export default async function Page() {
  const session = await auth();

  return (
    <>
      <Drugs session={session} />
    </>
  );
}
