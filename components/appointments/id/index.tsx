'use client';

import { AppointmentType } from '@/models/Appointment';
import { useQuery } from '@tanstack/react-query';
import { getAppointmentWithAID } from '@/functions/server-actions/appointment';
import NoResults from '@/components/ui/no-results';
import AppointmentDetail from '../compact-view/appointment-detail';

interface AppointmentProps {
  aid: number;
  session: any;
}

export default function Appointment({ aid, session }: AppointmentProps) {
  const {
    data: appointment,
    isError,
    error
  } = useQuery<AppointmentType>({
    queryKey: ['appointment', aid],
    queryFn: () => getAppointmentWithAID(aid)
  });

  if (isError) {
    return (
      <NoResults message="Appointment Not Found" description={error.message} />
    );
  }

  if (!appointment) {
    return <NoResults message="Appointment Not Found" />;
  }

  return <AppointmentDetail appointment={appointment} session={session} />;
}
