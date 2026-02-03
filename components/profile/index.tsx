'use client';

import { useSession } from '@/libs/providers/session-provider';

export default function Profile() {
  const session = useSession();

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
