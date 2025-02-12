import { auth } from '@/auth';
import Users from '@/components/dashboard/users';

export default async function Page() {
  const session = await auth();
  return (
    <>
      <Users session={session} />
    </>
  );
}
