import { auth } from '@/auth';
import DoctorAppointments from '@/components/appointments/doctor/doctor-appointment';
import PatientAppointments from '@/components/appointments/patient/patient-appointments';

export default async function Page() {
  const session = await auth();

  const patientMap: Record<string, React.ReactNode> = {
    user: <PatientAppointments session={session} />,
    doctor: <DoctorAppointments session={session} />,
    admin: <>Admin Appointments</>,
    receptionist: <>Receptionist Appointments</>
  };

  return <>{patientMap[session?.user?.role || 'user']}</>;
}
