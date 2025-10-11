'use client';
import { useSession } from '@/lib/providers/session-provider';

export default function Dashboard() {
  const { user } = useSession();

  if (!user) return <p>Not logged in</p>;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Organization: {user?.organization || 'None'}</p>
      <p>Phone: {user?.phone || 'Not provided'}</p>
    </div>
  );
}
