import { auth } from '@/auth';
import Services from '@/components/dashboard/services';

export default async function Page() {
  const session = await auth();
  return (
    <>
      <Services session={session} />
    </>
  );
}
