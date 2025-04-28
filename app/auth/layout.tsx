import { redirect } from 'next/navigation';

import { auth } from '@/auth';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return <>{children}</>;
};

export default AuthLayout;
