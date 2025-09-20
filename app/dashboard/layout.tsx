import { redirect } from 'next/navigation';

import { getServerSession } from '@/lib/serverAuth';
import DashboardLayout from '@/components/layouts/dashboard';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
