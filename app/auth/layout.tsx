import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/serverAuth';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (session) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
