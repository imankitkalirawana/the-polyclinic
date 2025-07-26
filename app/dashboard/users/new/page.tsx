import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import NewUser from '@/components/dashboard/users/new';
import { getAllCountries } from '@/services/api/external';

const allowedRoles = [
  'admin',
  'doctor',
  'nurse',
  'receptionist',
  'pharmacist',
  'laboratorist',
];

export default async function Page() {
  const session = await auth();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await getAllCountries();
      if (res.success) {
        return res.data;
      }
      throw new Error(res.message);
    },
  });

  if (!allowedRoles.includes(session?.user?.role)) {
    return redirect('/dashboard');
  }

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NewUser />
      </HydrationBoundary>
    </>
  );
}
