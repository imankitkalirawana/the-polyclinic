import UserCard from '@/components/dashboard/users/user';
import { API_BASE_URL, isCaching } from '@/lib/config';
import { User } from '@/lib/interface';
import { cookies } from 'next/headers';

async function getData(id: string) {
  const res = await fetch(`${API_BASE_URL}api/users/${id}`, {
    cache: isCaching ? 'default' : 'no-cache',
    method: 'GET',
    headers: { Cookie: cookies().toString() }
  });
  if (res.ok) {
    const json = await res.json();
    return json;
  }
}

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const user: User = await getData(params.id);
  return (
    <>
      <UserCard user={user} />
    </>
  );
}
