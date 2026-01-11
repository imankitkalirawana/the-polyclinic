import { useFormContext } from 'react-hook-form';
import { ScrollShadow } from '@heroui/react';
import { CreateUser, Role } from '@/services/common/user';
import CommonFields from './common-fields';
import PatientFields from './patient-fields';
import DoctorFields from './doctor-fields';

export default function NewUserFormInputs() {
  const form = useFormContext<CreateUser>();
  const role = form.watch('role');

  return (
    <ScrollShadow className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
      <CommonFields form={form} />

      {role === Role.PATIENT && <PatientFields />}

      {role === Role.DOCTOR && <DoctorFields />}
    </ScrollShadow>
  );
}
