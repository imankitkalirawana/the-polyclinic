import { unauthorized } from 'next/navigation';

import { auth } from '@/auth';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const allowedRoles = ['superadmin'];

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    unauthorized();
  }

  return children;
}
