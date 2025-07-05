'use client';
import { useAllUsers } from '@/services/user';

export default function Home() {
  const users = useAllUsers();

  return (
    <>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </>
  );
}
