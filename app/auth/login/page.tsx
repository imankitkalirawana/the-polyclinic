import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import SignIn from '@/components/auth/SignIn';

export default async function Login() {
  const session = await auth();

  if (session) {
   // redirect('/');
  }
  return (
    <div
      className="mt-0 min-h-screen w-full bg-cover bg-center bg-no-repeat object-cover pt-24"
      style={{
        backgroundImage: 'url(/assets/chromatic_light_2.heic)',
      }}
    >
      <SignIn />
    </div>
  );
}
