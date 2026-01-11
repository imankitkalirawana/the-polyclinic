import { useFormContext } from 'react-hook-form';
import { CreateUser } from '@/services/common/user/user.types';
import { Role } from '@/services/common/user/user.constants';
import CommonFields from './common-fields';
import PatientFields from './patient-fields';
import DoctorFields from './doctor-fields';

export default function NewUserForm() {
  const form = useFormContext<CreateUser>();
  const role = form.watch('role');

  return (
    <div className="grid grid-cols-1 gap-4 p-1 py-4 md:grid-cols-2 lg:grid-cols-3">
      <CommonFields />

      {role === Role.PATIENT && <PatientFields />}

      {role === Role.DOCTOR && <DoctorFields />}
    </div>
  );
}
