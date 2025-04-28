import React from 'react';

import { auth } from '@/auth';
import TabularView from '@/components/appointments/tabular-view';
import UseRedirect from '@/hooks/useRedirect';

const AllAppointmentsPage = async () => {
  const session = await auth();

  if (!session) {
    return <UseRedirect />;
  }

  return (
    <>
      <TabularView session={session} />
    </>
  );
};

export default AllAppointmentsPage;
