import { useSpecializations } from '@/services/client/doctor';
import { UserFormValues } from '@/services/common/user/user.types';
import { Input, NumberInput, Select, SelectItem, Textarea } from '@heroui/react';
import { Control, Controller } from 'react-hook-form';

export default function DoctorFields({ control }: { control: Control<UserFormValues> }) {
  const { data: specializations = [] } = useSpecializations();

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
        name="doctor.specializations"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            selectionMode="multiple"
            ref={field.ref}
            label="Specialization"
            placeholder="eg. Cardiology, Neurology"
            selectedKeys={
              field.value?.filter((k): k is string => typeof k === 'string' && k !== '') ?? []
            }
            onSelectionChange={(keys) => {
              const set = keys as Set<string>;
              field.onChange(set.size ? Array.from(set) : undefined);
            }}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          >
            {specializations.map((specialization) => (
              <SelectItem key={specialization.id}>{specialization.name}</SelectItem>
            ))}
          </Select>
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
