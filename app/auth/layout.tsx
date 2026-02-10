import { redirect } from 'next/navigation';
import { getServerSession } from '@/libs/serverAuth';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (session) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
