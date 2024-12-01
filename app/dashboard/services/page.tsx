import Services from '@/components/dashboard/services';
import QuillInput from '@/components/ui/quill-input';
import { API_BASE_URL, isCaching } from '@/lib/config';
import { Service } from '@/lib/interface';
import { Input, Textarea } from '@nextui-org/react';
import { cookies } from 'next/headers';

async function getServices() {
  const res = await fetch(`${API_BASE_URL}api/services/all`, {
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
  const services: Service[] = await getServices();
  return (
    <>
      {/* <Textarea label="Title" /> */}
      <Services services={services} />
      {/* <QuillInput label="Title" /> */}
    </>
  );
}
