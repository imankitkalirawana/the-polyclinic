import ProductViewInfo from '@/components/dashboard/services/service-item';
import { API_BASE_URL, isCaching } from '@/lib/config';
import { Service as ServiceType } from '@/lib/interface';
import { cookies } from 'next/headers';

async function getData(uid: string) {
  const res = await fetch(`${API_BASE_URL}api/services/uid/${uid}`, {
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
    uid: string;
  };
}

export default async function Page({ params }: Props) {
  const service: ServiceType = await getData(params.uid);
  return (
    <>
      <div className="h-full w-full px-2">
        <ProductViewInfo service={service} />
      </div>
    </>
  );
}
