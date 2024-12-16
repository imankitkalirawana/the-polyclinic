import Drugs from '@/components/dashboard/drugs';
import { API_BASE_URL } from '@/lib/config';
import { DrugType } from '@/models/Drug';
import axios from 'axios';
import { cookies } from 'next/headers';

async function getData() {
  try {
    const res = await axios.get(`${API_BASE_URL}api/drugs`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
  }
}

export default async function Page() {
  const drugs: DrugType[] = (await getData()) || ([] as DrugType[]);
  return (
    <>
      <Drugs drugs={drugs} />
    </>
  );
}
