import { DoctorType } from '@/types/doctor';

export const CreateAppointmentDoctorDetails = ({ doctor }: { doctor?: DoctorType | null }) => {
  if (!doctor) return null;

  return (
    <div>
      <div>Name: {doctor.name}</div>
      <div>Email: {doctor.email}</div>
      <div>Phone: {doctor.phone}</div>
    </div>
  );
};
