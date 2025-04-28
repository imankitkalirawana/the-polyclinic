import Error from '@/app/error';
import { auth } from '@/auth';

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const allowed = ['admin', 'receptionist', 'doctor'];
  return (
    <>
      {
        // @ts-ignore
        session && allowed.includes(session.user.role) ? (
          children
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

export default Layout;
