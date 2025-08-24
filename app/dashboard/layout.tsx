import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import DashboardLayout from '@/components/dashboard/layout';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const allowedRoles = ['superadmin', 'ops', 'dev'];

  if (!allowedRoles.includes(session.user.role)) {
    redirect('/');
  }

  return <>{session && <DashboardLayout session={session}>{children}</DashboardLayout>}</>;
}
