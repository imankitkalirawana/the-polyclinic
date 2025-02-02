import * as React from 'react';
import Header from './header';
import { auth } from '@/auth';
import PatientAppointment from './patient';

export default async function NewAppointment() {
  const session = await auth();

  const RoleMap: Record<string, React.ReactNode> = {
    user: <PatientAppointment session={session} />,
    doctor: <div>Doctor Appointment</div>,
    admin: <div>Admin Appointment</div>
  };

  return (
    <div className="mx-auto max-w-7xl">
      <Header session={session} />
      {RoleMap[session?.user?.role]}
    </div>
  );
}
