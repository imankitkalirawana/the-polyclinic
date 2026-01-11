import { Controller, useFormContext } from 'react-hook-form';
import { Input, Select, SelectItem, NumberInput } from '@heroui/react';
import { GENDERS } from '@/lib/constants';
import { CreateUser } from '@/services/common/user/user.types';

export default function PatientFields() {
  const form = useFormContext<CreateUser>();
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Select
            label="Gender"
            placeholder="Select Gender"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => {
              const selectedGender = Array.from(keys)[0];
              if (typeof selectedGender === 'string') {
                field.onChange(selectedGender);
              }
            }}
            isInvalid={!!errors.gender}
            errorMessage={errors.gender?.message}
            items={GENDERS.map((gender) => ({
              label: gender.charAt(0).toUpperCase() + gender.slice(1),
              value: gender,
            }))}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
        )}
      />

      <Controller
        name="age"
        control={control}
        render={({ field }) => (
          <NumberInput
            label="Age"
            placeholder="Enter age"
            value={field.value || undefined}
            onChange={(value) => {
              const numValue = value ? parseInt(value.toString(), 10) : undefined;
              field.onChange(numValue);
            }}
            isInvalid={!!errors.age}
            errorMessage={errors.age?.message}
          />
        )}
      />

      <Input
        label="Address"
        placeholder="Enter address"
        {...register('address')}
        isInvalid={!!errors.address}
        errorMessage={errors.address?.message}
      />
    </>
  );
}
