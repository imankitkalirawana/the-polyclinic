'use client';
import * as React from 'react';

import NoSession from './no-session';
import Session from './session';
import { useSession } from 'next-auth/react';

export default async function NewAppointment() {
  const { data: session } = useSession();

  if (!session) {
    return <NoSession />;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Session session={session} />
    </div>
  );
}
