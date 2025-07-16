import { auth } from '@/auth';
import { unauthorized } from 'next/navigation';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const allowed = ['admin', 'receptionist', 'doctor', 'user'];

  if (!session || !allowed.includes(session?.user?.role)) {
    unauthorized();
  }

  return children;
}
