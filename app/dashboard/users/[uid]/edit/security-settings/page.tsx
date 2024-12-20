import SecuritySettings from '@/components/dashboard/users/edit/security-settings';
import { API_BASE_URL } from '@/lib/config';
import axios from 'axios';
import { cookies } from 'next/headers';

async function getData(uid: number) {
  try {
    const res = await axios.get(`${API_BASE_URL}api/users/uid/${uid}`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching user data');
  }
}

interface Props {
  params: {
    uid: number;
  };
}

export default async function Page({ params }: Props) {
  const user = await getData(params.uid);
  return (
    <>
      <SecuritySettings user={user} />
    </>
  );
}
