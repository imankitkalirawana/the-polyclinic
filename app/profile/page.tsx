import { getServerSession } from '@/lib/serverAuth';

export default async function Profile() {
  const session = await getServerSession();

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
