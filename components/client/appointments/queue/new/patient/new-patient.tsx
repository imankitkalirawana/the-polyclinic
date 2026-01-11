import Modal from '@/components/ui/modal';
import { useForm } from 'react-hook-form';
import { NewPatientRequest } from '@/services/client/patient/patient.types';
import { Input, NumberInput, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPatientSchema } from '@/services/client/patient/patient.validation';
import { GENDERS } from '@/lib/constants';
import { useCreatePatient } from '@/services/client/patient/patient.query';

export default function NewPatient({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: (id: string) => void;
}) {
  const form = useForm<NewPatientRequest>({
    resolver: zodResolver(newPatientSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { mutate: createPatient } = useCreatePatient();

  const onSubmit = (data: NewPatientRequest) => {
    createPatient(data, {
      onSuccess: (result) => {
        if (result.success && result.data?.id) {
          onSuccess?.(result.data.id);
        }
      },
    });
  };

  const renderBody = () => {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Input
          {...register('name')}
          autoFocus
          isRequired
          label="Name"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
        <Input
          {...register('phone')}
          isRequired
          label="Phone"
          isInvalid={!!errors.phone}
          errorMessage={errors.phone?.message}
        />
        <Select
          {...register('gender')}
          isRequired
          disallowEmptySelection
          label="Gender"
          isInvalid={!!errors.gender}
          errorMessage={errors.gender?.message}
        >
          {GENDERS.map((gender) => (
            <SelectItem key={gender} className="capitalize">
              {gender.toLowerCase()}
            </SelectItem>
          ))}
        </Select>
        {/* @ts-ignore */}
        <NumberInput
          {...register('age', { valueAsNumber: true })}
          label="Age"
          isInvalid={!!errors.age}
          errorMessage={errors.age?.message}
        />
        <Input
          {...register('email')}
          label="Email (Optional)"
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />

        <Input
          {...register('address')}
          label="Address"
          isInvalid={!!errors.address}
          errorMessage={errors.address?.message}
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen
      size="4xl"
      onClose={onClose}
      title="Create New Patient"
      subtitle="Create a new patient to book the appointment."
      body={renderBody()}
      submitButton={{
        children: 'Create',
        whileSubmitting: 'Creating patient...',
      }}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
