'use client';

import { Input, NumberInput, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import Modal from '@/components/ui/modal';
import { Patient } from '@repo/store';
import { useUpdateUser } from '@/services/common/user/user.query';
import { Gender } from '@repo/store';

const PHONE_REGEX = /^[6-9]\d{9}$/;

const editPatientSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Please enter a valid email address'),
  phone: z
    .union([z.string().trim(), z.literal(''), z.undefined(), z.null()])
    .refine((value) => !value || PHONE_REGEX.test(value), {
      message: 'Phone number must be a valid 10-digit number.',
    }),
  gender: z.union([z.enum(Gender), z.literal(''), z.undefined(), z.null()]),
  age: z.union([
    z
      .number()
      .int()
      .min(0, 'Age must be between 0 and 120')
      .max(120, 'Age must be between 0 and 120'),
    z.undefined(),
    z.null(),
  ]),
  address: z.union([
    z.string().trim().max(200, 'Address must be 200 characters or fewer'),
    z.literal(''),
    z.undefined(),
    z.null(),
  ]),
});

type EditPatientFormValues = z.infer<typeof editPatientSchema>;

interface EditPatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  isOpen?: boolean;
}

export default function EditPatientModal({ patient, onClose, isOpen }: EditPatientModalProps) {
  const updateUser = useUpdateUser();

  const form = useForm<EditPatientFormValues>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      name: patient?.name ?? '',
      email: patient?.email ?? '',
      phone: patient?.phone ?? '',
      address: patient?.address ?? '',
      gender: patient?.gender ?? '',
      age: patient?.age ?? 0,
    },
  });

  const handleSubmit = async () => {
    onClose();
  };

  const renderBody = () => {
    if (!patient) {
      return <p className="text-default-500 py-6 text-center">Unable to load patient details.</p>;
    }

    return (
      <FormProvider {...form}>
        <div className="grid grid-cols-1 gap-4 p-1 py-4 md:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                autoFocus
                isRequired
                label="Full Name"
                placeholder="eg. John Doe"
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                isInvalid={!!form.formState.errors.name}
                errorMessage={form.formState.errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                isRequired
                label="Email"
                placeholder="Enter email"
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                isInvalid={!!form.formState.errors.email}
                errorMessage={form.formState.errors.email?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                label="Phone Number"
                placeholder="Enter phone number"
                value={field.value ?? ''}
                onChange={(event) => field.onChange(event.target.value)}
                isInvalid={!!form.formState.errors.phone}
                errorMessage={form.formState.errors.phone?.message}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">+91</span>
                  </div>
                }
              />
            )}
          />

          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Select
                label="Gender"
                placeholder="Select gender"
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  field.onChange(typeof selected === 'string' ? selected : '');
                }}
                isClearable
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              >
                {Object.keys(Gender).map((gender) => (
                  <SelectItem key={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="age"
            control={form.control}
            render={({ field }) => (
              <NumberInput
                label="Age"
                placeholder="Enter age"
                value={typeof field.value === 'number' ? field.value : undefined}
                onChange={(value) => {
                  if (typeof value !== 'number') {
                    field.onChange(undefined);
                    return;
                  }
                  field.onChange(Number.isNaN(value) ? undefined : value);
                }}
                minValue={0}
                maxValue={120}
                isInvalid={!!form.formState.errors.age}
                errorMessage={form.formState.errors.age?.message}
              />
            )}
          />

          <Controller
            name="address"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                label="Address"
                placeholder="Enter address"
                value={field.value ?? ''}
                onChange={(event) => field.onChange(event.target.value)}
                isInvalid={!!form.formState.errors.address}
                errorMessage={form.formState.errors.address?.message}
              />
            )}
          />
        </div>
      </FormProvider>
    );
  };

  return (
    <Modal
      isOpen={isOpen ?? !!patient}
      onClose={onClose}
      size="4xl"
      title="Edit Patient"
      subtitle="Update patient details to keep their profile accurate."
      body={renderBody()}
      submitButton={{
        children: 'Update Patient',
        whileSubmitting: 'Updating patient...',
        isLoading: updateUser.isPending,
        isDisabled: !patient,
      }}
      onSubmit={form.handleSubmit(handleSubmit)}
    />
  );
}
