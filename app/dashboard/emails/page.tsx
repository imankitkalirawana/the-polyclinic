import { auth } from '@/auth';
import Emails from '@/components/dashboard/emails';

const EmailsPage = async () => {
  const session = await auth();

  return (
    <>
      <Emails session={session} />
    </>
  );
};

export default EmailsPage;
