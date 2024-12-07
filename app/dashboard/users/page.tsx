import Users from '@/components/dashboard/users';
import { API_BASE_URL } from '@/lib/config';
import { User } from '@/lib/interface';
import axios from 'axios';
import { cookies } from 'next/headers';

async function getData() {
  try {
    const res = await axios.get(`${API_BASE_URL}api/users/all`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
  }
}

export default async function Page() {
  const users: User[] = (await getData()) || ([] as User[]);
  return (
    <>
      <Users users={users} />
    </>
  );
}
