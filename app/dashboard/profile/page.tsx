import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import Profile from '@/components/dashboard/profile';
import { getSelf } from '@/functions/server-actions/user';

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  const res = await getSelf({ email: session?.user?.email || '' });

  return <Profile self={res.user} />;
}
