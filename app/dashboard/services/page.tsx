import Services from '@/components/dashboard/services';
import { API_BASE_URL } from '@/lib/config';
import { Service } from '@/lib/interface';
import axios from 'axios';
import { cookies } from 'next/headers';

async function getData() {
  try {
    const res = await axios.get(`${API_BASE_URL}api/services/all`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
  }
}

export default async function Page() {
  const services: Service[] = (await getData()) || ([] as Service[]);
  return (
    <>
      <Services services={services} />
    </>
  );
}
