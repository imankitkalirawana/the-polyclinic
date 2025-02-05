import * as React from 'react';
import PatientAppointment from './patient';
import NoSession from './no-session';

export default async function NewAppointment({ session }: { session: any }) {
  const RoleMap: Record<string, React.ReactNode> = {
    user: <PatientAppointment session={session} />,
    doctor: <div>Doctor Appointment</div>,
    admin: <PatientAppointment session={session} />
  };

  if (!session) {
    return <NoSession />;
  }

  return (
    <div className="mx-auto max-w-7xl">{RoleMap[session?.user?.role]}</div>
  );
}
