import Register from '@/components/auth/register';
import { WEBSITE_SETTING } from '@/lib/config';

export default function RegisterPage() {
  if (!WEBSITE_SETTING.status.registration) {
    return <div>Registration is disabled</div>;
  }
  return <Register />;
}
