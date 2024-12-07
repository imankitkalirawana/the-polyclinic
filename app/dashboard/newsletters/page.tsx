import Error from '@/app/error';
import Newsletters from '@/components/dashboard/newsletters/newsletters';
import { API_BASE_URL } from '@/lib/config';
import { Newsletter } from '@/lib/interface';
import axios from 'axios';
import { cookies } from 'next/headers';

async function getData() {
  try {
    const res = await axios.get(`${API_BASE_URL}api/newsletter`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
  }
}

export default async function Page() {
  const newsletters: Newsletter[] = (await getData()) || ([] as Newsletter[]);
  console.log(newsletters);
  return (
    <>
      <Newsletters newsletters={newsletters} />
    </>
  );
}
