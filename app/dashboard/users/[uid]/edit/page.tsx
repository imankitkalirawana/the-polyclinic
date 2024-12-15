import EditUser from '@/components/dashboard/users/edit';
import { countryProp } from '@/components/dashboard/users/edit/countries';
import { getCountries } from '@/functions/get';
import { API_BASE_URL, isCaching } from '@/lib/config';
import { transformCountries } from '@/lib/functions';
import { UserType } from '@/models/User';
import axios from 'axios';
import { cookies } from 'next/headers';

async function getData(uid: number) {
  try {
    const res = await axios.get(`${API_BASE_URL}api/users/uid/${uid}`, {
      headers: { Cookie: cookies().toString() }
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

interface Props {
  params: {
    uid: number;
  };
}

export default async function Page({ params }: Props) {
  const user: UserType = (await getData(params.uid)) || ({} as UserType);
  const countries = await getCountries();
  return (
    <>
      <EditUser user={user} countries={countries} />
    </>
  );
}
