import { getServerSession } from '@/lib/serverAuth';
import DashboardLayout from '@/components/layouts/dashboard';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  console.log('session', session);

  return <DashboardLayout>{children}</DashboardLayout>;
}
