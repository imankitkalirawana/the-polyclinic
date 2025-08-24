import Login from '@/components/auth/login';
import { getSubdomain } from '@/auth/sub-domain';

export default async function LoginPage() {
  const subdomain = await getSubdomain();

  return <Login subdomain={subdomain} />;
}
