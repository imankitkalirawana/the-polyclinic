import { UserType } from '@/types/user';

export const CreateAppointmentPatientDetails = ({ user }: { user?: UserType | null }) => {
  if (!user) return <div>Select a patient to view details</div>;

  return (
    <div>
      <div>UID: #{user.uid}</div>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
      <div>Phone: {user.phone}</div>
    </div>
  );
};
