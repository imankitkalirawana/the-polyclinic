import Login from '@/components/auth/login';
import { getSubdomain } from '@/auth/sub-domain';

export default async function LoginPage() {
  const subdomain = await getSubdomain();
  console.log('process.env.NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL);

  return <Login subdomain={subdomain} />;
}
