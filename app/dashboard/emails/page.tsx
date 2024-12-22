import Emails from '@/components/dashboard/emails';
import { API_BASE_URL } from '@/lib/config';
import { EmailType } from '@/models/Email';
import axios from 'axios';
import { cookies } from 'next/headers';

async function getData() {
  try {
    const res = await axios.get(`${API_BASE_URL}api/emails`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
  }
}

export default async function Page() {
  const emails: EmailType[] = (await getData()) || ([] as EmailType[]);
  return (
    <>
      <Emails emails={emails} />
    </>
  );
}
