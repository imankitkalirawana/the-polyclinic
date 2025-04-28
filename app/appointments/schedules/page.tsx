import React from 'react';

import { auth } from '@/auth';
import CompactView from '@/components/appointments/compact-view';
import UseRedirect from '@/hooks/useRedirect';

const SchedulesPage = async () => {
  const session = await auth();

  if (!session) {
    return <UseRedirect />;
  }

  return (
    <>
      <CompactView />
    </>
  );
};

export default SchedulesPage;
