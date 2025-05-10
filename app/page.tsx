'use client';
import { useSession } from 'next-auth/react';
import { addToast, Button } from '@heroui/react';
import { toast } from 'sonner';

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      {session && <div>{session.user?.email}</div>}
      <Button
        className="absolute mt-4"
        onPress={() => {
          toast.promise(
            new Promise((resolve) => {
              setTimeout(() => {
                resolve('Event has been created');
              }, 5000);
            }),
            {
              loading: 'Creating event...',
              success: 'Event has been created',
            }
          );
          addToast({
            title: 'Event has been created',
            description: 'Monday, January 3rd at 6:00pm',
            color: 'success',
          });
        }}
      >
        Click me
      </Button>
    </>
  );
}
