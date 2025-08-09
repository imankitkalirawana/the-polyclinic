import { UserType } from '@/types/user';

export const CreateAppointmentPatientDetails = ({ user }: { user?: UserType | null }) => {
  if (!user) return null;

  return (
    <div>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
      <div>Phone: {user.phone}</div>
    </div>
  );
};
