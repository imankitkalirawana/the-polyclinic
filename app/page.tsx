'use client';
import { useSession } from 'next-auth/react';
import { Button } from '@heroui/react';

export default function Home() {
  const { data: session, update } = useSession();

  console.log(session);

  return (
    <>
      {session && <div>{session.user?.email}</div>}
      <Button
        className="absolute mt-4"
        onPress={() => {
          update();
        }}
      >
        Click me
      </Button>
    </>
  );
}
