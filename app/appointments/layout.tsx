import { redirect, unauthorized } from 'next/navigation';
import { getServerSession } from '@/libs/serverAuth';
import { UserRole } from '@/shared';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const ALLOWED_ROLES: UserRole[] = [
    UserRole.ADMIN,
    UserRole.RECEPTIONIST,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ];

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (!ALLOWED_ROLES.includes(session.user?.role)) {
    unauthorized();
  }

  return children;
}
