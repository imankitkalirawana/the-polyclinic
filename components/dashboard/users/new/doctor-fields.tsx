import { Input, Textarea } from '@heroui/react';
import { CreateUser } from '@/services/common/user';
import { useFormContext } from 'react-hook-form';

export default function DoctorFields() {
  const form = useFormContext<CreateUser>();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <Input
        label="Specialization"
        placeholder="eg. Cardiologist"
        {...register('specialization')}
        isInvalid={!!errors.specialization}
        errorMessage={errors.specialization?.message}
      />

      <Input
        label="Department"
        placeholder="eg. Cardiology"
        {...register('department')}
        isInvalid={!!errors.department}
        errorMessage={errors.department?.message}
      />

      <Input
        label="Seating"
        placeholder="eg. Room No, Floor"
        {...register('seating')}
        isInvalid={!!errors.seating}
        errorMessage={errors.seating?.message}
      />

      <Input
        label="Education"
        placeholder="eg. MBBS, MD"
        {...register('education')}
        isInvalid={!!errors.education}
        errorMessage={errors.education?.message}
      />

      <Textarea
        className="col-span-2"
        label="Biography"
        placeholder="eg. Experienced cardiologist"
        {...register('biography')}
        isInvalid={!!errors.biography}
        errorMessage={errors.biography?.message}
      />
    </>
  );
}
