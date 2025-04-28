import { auth } from '@/auth';
import NewAppointment from '@/components/appointments/new';

const NewAppointmentPage = async () => {
  const session = await auth();
  return <NewAppointment session={session} />;
};

export default NewAppointmentPage;
