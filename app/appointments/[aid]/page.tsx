import { auth } from '@/auth';
import ViewAppointment from '@/components/appointments/id';

interface Props {
  params: {
    aid: string;
  };
}

export default async function Page({ params }: Props) {
  const session = await auth();

  return (
    <>
      <ViewAppointment session={session} aid={params.aid} />
    </>
  );
}
