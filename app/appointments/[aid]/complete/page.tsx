import Error from '@/app/error';
import { auth } from '@/auth';

interface Props {
  params: {
    aid: string;
  };
}

export default async function Page({ params }: Props) {
  const session = await auth();

  const allowed = ['admin', 'doctor'];

  if (session?.user && !allowed.includes(session.user.role)) {
    return (
      <Error
        code="401"
        title="Whoops, Not So Fast"
        description="You're trying to peek behind the curtain, but authorization is required. Let's set things right."
      />
    );
  }

  return <>Complete Appointment</>;
}
