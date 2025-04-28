import Error from '@/app/error';
import { auth } from '@/auth';
import NewService from '@/components/dashboard/services/new';

const NewServicePage = async () => {
  const session = await auth();
  const allowed = ['admin'];
  return (
    <>
      {
        // @ts-ignore
        session && allowed.includes(session.user.role) ? (
          <div className="h-full w-full max-w-8xl px-2">
            <NewService />
          </div>
        ) : (
          <Error
            code="401"
            title="Whoops, Not So Fast"
            description="You're trying to peek behind the curtain, but authorization is required. Let's set things right."
          />
        )
      }
    </>
  );
};

export default NewServicePage;
