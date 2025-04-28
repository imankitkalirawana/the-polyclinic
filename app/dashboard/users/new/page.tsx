import NewUser from '@/components/dashboard/users/new';
import { getCountries } from '@/functions/get';

const NewUserPage = async () => {
  const countries = await getCountries();
  return (
    <>
      <NewUser countries={countries} />
    </>
  );
};

export default NewUserPage;
