import { auth } from '@/auth';
import Drugs from '@/components/dashboard/drugs';

const DrugsPage = async () => {
  const session = await auth();

  return (
    <>
      <Drugs session={session} />
    </>
  );
};

export default DrugsPage;
