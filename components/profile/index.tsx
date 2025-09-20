'use client';

import { apiRequest } from '@/lib/axios';
import { Session } from '@/types/session';
import { useQuery } from '@tanstack/react-query';

export default function Profile() {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await apiRequest<Session>({
        url: '/auth/session',
        method: 'GET',
      });
      return res.data;
    },
  });

  if (!session) return <p>Not logged in</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
      <p>Role: {session.user?.role}</p>
      <p>Organization: {session.user?.organization || 'None'}</p>
      <p>Phone: {session.user?.phone || 'Not provided'}</p>
    </div>
  );
}
