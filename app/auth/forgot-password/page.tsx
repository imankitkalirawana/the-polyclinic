import { auth } from '@/auth';
import ForgotPassword from '@/components/auth/ForgotPassword';
import { redirect } from 'next/navigation';

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
