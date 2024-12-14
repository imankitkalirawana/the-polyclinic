import Error from '@/app/error';
import { auth } from '@/auth';

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <>
      {
        // @ts-ignore
        session ? (
          <div className="mx-auto max-w-7xl px-4">{children}</div>
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
}
