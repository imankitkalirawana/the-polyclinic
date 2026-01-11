import { Input, NumberInput, Textarea } from '@heroui/react';
import { CreateUser } from '@/services/common/user';
import { useFormContext, Controller } from 'react-hook-form';

export default function DoctorFields() {
  const form = useFormContext<CreateUser>();
  const { control } = form;

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
        render={({ field, fieldState }) => (
          <NumberInput
            {...field}
            value={field.value || undefined}
            label="Experience"
            placeholder="eg. 10"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            endContent={<span className="text-default-500">years</span>}
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
