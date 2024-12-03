import EditUser from '@/components/dashboard/users/edit';
import { countryProp } from '@/components/dashboard/users/edit/countries';
import { getCountries } from '@/functions/get';
import { API_BASE_URL, isCaching } from '@/lib/config';
import { transformCountries } from '@/lib/functions';
import { User } from '@/lib/interface';
import { cookies } from 'next/headers';

async function getData(id: string) {
  const res = await fetch(`${API_BASE_URL}api/users/${id}`, {
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
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const user: User = await getData(params.id);
  const countries = await getCountries();
  console.log(user, countries?.slice(0, 5));
  return <>{/* <EditUser user={user} countries={countries} /> */}</>;
}
