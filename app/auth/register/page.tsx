import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import Register from '@/components/auth/Register';

export default async function Login() {
  const session = await auth();

  if (session) {
    //redirect('/dashboard');
  }
  return (
    <div
      className="mt-0 min-h-screen w-full bg-cover bg-center bg-no-repeat object-cover pt-24"
      style={{
        backgroundImage: 'url(/assets/chromatic_light_2.heic)',
      }}
    >
      <Register />
    </div>
  );
}
