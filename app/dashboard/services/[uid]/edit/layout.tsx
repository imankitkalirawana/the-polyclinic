import { unauthorized } from 'next/navigation';

import { getServerSession } from '@/lib/serverAuth';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const allowed = ['admin', 'receptionist', 'doctor'];

  if (!session) {
    unauthorized();
  }

  if (session?.user?.role && !allowed.includes(session?.user?.role)) {
    unauthorized();
  }

  return children;
}
