import NewUser from '@/components/dashboard/users/new';
import { getCountries } from '@/functions/get';

export default async function Page() {
  const countries = await getCountries();
  return (
    <>
      <NewUser countries={countries} />
    </>
  );
}
