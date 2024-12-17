import Services from '@/components/dashboard/services';
import { API_BASE_URL } from '@/lib/config';
import { ServiceType } from '@/models/Service';
import axios from 'axios';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

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
  const services: ServiceType[] = (await getData()) || ([] as ServiceType[]);
  return (
    <>
      <Services services={services} />
    </>
  );
}
