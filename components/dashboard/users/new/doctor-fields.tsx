import { Input, NumberInput, Textarea } from '@heroui/react';
import { CreateUserRequest } from '@/services/common/user/user.types';
import { useFormContext, Controller } from 'react-hook-form';

export default function DoctorFields() {
  const form = useFormContext<CreateUserRequest>();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <Controller
        name="specialization"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            value={field.value ?? ''}
            label="Specialization"
            placeholder="eg. Cardiologist"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="department"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            value={field.value ?? ''}
            label="Department"
            placeholder="eg. Cardiology"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="seating"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            value={field.value ?? ''}
            label="Seating"
            placeholder="eg. Room No, Floor"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="education"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            value={field.value ?? ''}
            label="Education"
            placeholder="eg. MBBS, MD"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="designation"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            value={field.value ?? ''}
            label="Designation"
            placeholder="eg. Cardiologist"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="experience"
        control={control}
        render={({ field }) => (
          <NumberInput
            label="Experience"
            placeholder="Enter experience"
            value={field.value || undefined}
            onChange={(value) => {
              const numValue = value ? parseInt(value.toString(), 10) : undefined;
              field.onChange(numValue);
            }}
            isInvalid={!!errors.experience}
            errorMessage={errors.experience?.message}
            endContent={<span className="text-default-500">year(s)</span>}
          />
        )}
      />

      <Controller
        name="biography"
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            value={field.value ?? ''}
            label="Biography"
            placeholder="eg. Experienced cardiologist"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </>
  );
}
