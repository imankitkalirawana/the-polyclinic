import UserCard from '@/components/dashboard/users/user';
import { API_BASE_URL } from '@/lib/config';
import { UserType } from '@/models/User';
import axios from 'axios';
import { cookies } from 'next/headers';
import { getUserWithUID } from '@/functions/server-actions';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';

// async function getData(uid: number) {
//   try {
//     const res = await axios.get(`${API_BASE_URL}api/users/uid/${uid}`, {
//       headers: { Cookie: cookies().toString() }
//     });
//     return res.data;
//   } catch (error) {
//     console.error('Error fetching user data');
//   }
// }

interface Props {
  params: {
    uid: number;
  };
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', params.uid],
    queryFn: () => getUserWithUID(params.uid)
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserCard uid={params.uid} />
      </HydrationBoundary>
    </>
  );
}
