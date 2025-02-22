import * as React from 'react';
import NoSession from './no-session';

import Session from './session';

export default async function NewAppointment({ session }: { session: any }) {
  if (!session) {
    return <NoSession />;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Session session={session} />
    </div>
  );
}
