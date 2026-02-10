import { getServerSession } from '@/libs/serverAuth';
import DashboardLayout from '@/components/layouts/dashboard';
import { unauthorized } from 'next/navigation';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session) {
    unauthorized();
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
