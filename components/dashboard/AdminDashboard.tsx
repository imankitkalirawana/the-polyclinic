'use client';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@nextui-org/react';

export const AdminDashboard = () => {
  const { data: session } = useSession();
  return (
    <>
      <h1>This is Admin dashboard</h1>
      {session && <p>Welcome, {session?.user?.name}! You are logged in.</p>}
      {session ? (
        <Button onClick={() => signOut()}>Logout</Button>
      ) : (
        <Button onClick={() => signIn()}>Login</Button>
      )}
    </>
  );
};
