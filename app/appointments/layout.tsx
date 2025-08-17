import { unauthorized } from 'next/navigation';

import { auth } from '@/auth';
import { headers } from 'next/headers';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session);
  const allowedRoles = ['admin', 'receptionist', 'doctor', 'patient'];

  if (!session || !allowedRoles.includes(session.user?.role ?? '')) {
    unauthorized();
  }

  return children;
}
