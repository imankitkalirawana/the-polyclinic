import { UpdateUserRequest } from '@/services/common/user/user.types';
import { Input, NumberInput, Textarea } from '@heroui/react';
import { Control, Controller } from 'react-hook-form';

export default function DoctorFields({ control }: { control: Control<UpdateUserRequest> }) {
  return (
    <>
      <Controller
        name="doctor.designation"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Designation"
            placeholder="eg. Senior Consultant"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="doctor.specialization"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Specialization"
            placeholder="eg. Cardiology, Neurology"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="doctor.experience"
        control={control}
        render={({ field, fieldState }) => (
          <NumberInput
            {...field}
            label="Experience"
            placeholder="eg. 10"
            value={field.value || 0}
            onChange={(value) => field.onChange(parseInt(value.toString()) || undefined)}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            endContent={<span className="text-default-400 text-small">years</span>}
          />
        )}
      />
      <Controller
        name="doctor.education"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Education"
            placeholder="eg. MBBS, MD"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="doctor.seating"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Seating"
            placeholder="eg. Room 101"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="doctor.biography"
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            className="col-span-full"
            label="Biography"
            placeholder="eg. Experienced in Cardiology and Neurology"
            value={field.value || ''}
            onChange={field.onChange}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </>
  );
}
