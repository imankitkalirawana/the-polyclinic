import { auth } from '@/auth';
import Services from '@/components/dashboard/services';

const ServicesPage = async () => {
  const session = await auth();

  return (
    <>
      <Services session={session} />
    </>
  );
};

export default ServicesPage;
