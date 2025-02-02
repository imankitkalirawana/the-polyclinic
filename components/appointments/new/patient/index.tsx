import ChooseUser from './choose-user';
import Selection from './selection';

export default function PatientAppointment({ session }: { session?: any }) {
  return (
    <>
      {/* <ChooseUser session={session} /> */}
      <Selection session={session} />
    </>
  );
}
