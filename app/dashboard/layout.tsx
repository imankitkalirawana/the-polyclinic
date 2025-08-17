import DashboardLayout from '@/components/dashboard/layout';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/login');
  }

  return <>{session && <DashboardLayout sessionUser={session.user}>{children}</DashboardLayout>}</>;
}
