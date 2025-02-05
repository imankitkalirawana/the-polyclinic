import Selection from '../selection';

export default function PatientAppointment({ session }: { session?: any }) {
  return (
    <>
      <Selection session={session} />
    </>
  );
}
