import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import ForgotPassword from '@/components/auth/ForgotPassword';

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }
  return (
    <>
      <ForgotPassword />
    </>
  );
}
