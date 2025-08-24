import { auth } from '@/auth';
import { redirect } from 'next/navigation';

interface OrganizationLayoutProps {
  params: Promise<{
    organization: string;
  }>;
  children: React.ReactNode;
}

export default async function OrganizationLayout({ children, params }: OrganizationLayoutProps) {
  const { organization } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.organization !== organization) {
    redirect('/dashboard');
  }

  return <div>{children}</div>;
}
