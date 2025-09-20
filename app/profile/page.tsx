import Profile from '@/components/profile';
// import { apiRequest } from '@/lib/axios';
// import { Session } from '@/types/session';
// import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

// export default async function ProfilePage() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ['session'],
//     queryFn: async () => {
//       try {
//         const res = await apiRequest<Session>({
//           url: '/auth/session',
//           method: 'GET',
//         });
//         return res.data;
//       } catch (error) {
//         return null;
//       }
//     },
//   });

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <Profile />
//     </HydrationBoundary>
//   );
// }

export default async function ProfilePage() {
  return <Profile />;
}
