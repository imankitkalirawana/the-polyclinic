import { unauthorized } from 'next/navigation';
import { getServerSession } from '@/lib/serverAuth';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const allowedRoles = ['admin', 'receptionist', 'doctor', 'patient'];

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    unauthorized();
  }

  return children;
}
