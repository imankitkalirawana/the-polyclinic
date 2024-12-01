import Users from '@/components/dashboard/users';
import { API_BASE_URL, isCaching } from '@/lib/config';
import { User } from '@/lib/interface';
import { cookies } from 'next/headers';

async function getData() {
  const res = await fetch(`${API_BASE_URL}api/users/all`, {
    cache: isCaching ? 'default' : 'no-cache',
    method: 'GET',
    headers: { Cookie: cookies().toString() }
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}

export default async function Page() {
  const users: User[] = await getData();
  return (
    <>
      <Users users={users} />
    </>
  );
}
