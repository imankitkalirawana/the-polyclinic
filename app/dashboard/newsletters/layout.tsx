import { unauthorized } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/auth';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const allowedRoles = ['admin', 'receptionist', 'doctor'];

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    unauthorized();
  }

  return children;
}
