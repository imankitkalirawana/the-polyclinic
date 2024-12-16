import EditDrug from '@/components/dashboard/drugs/drug/edit';
import { API_BASE_URL } from '@/lib/config';
import { DrugType } from '@/models/Drug';
import axios from 'axios';
import { cookies } from 'next/headers';

async function getData(did: number) {
  try {
    const res = await axios.get(`${API_BASE_URL}api/drugs/did/${did}`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

interface Props {
  params: {
    did: number;
  };
}

export default async function Page({ params }: Props) {
  const drug: DrugType = (await getData(params.did)) || ({} as DrugType);
  return (
    <>
      <EditDrug drug={drug} />
    </>
  );
}
