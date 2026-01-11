import Modal from '@/components/ui/modal';
import { useForm } from 'react-hook-form';
import { NewPatientRequest } from '@/services/client/patient/patient.types';
import { Input, NumberInput, Select, SelectItem } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPatientSchema } from '@/services/client/patient/patient.validation';
import { GENDERS } from '@/lib/constants';
import { useCreatePatient } from '@/services/client/patient/patient.query';
import NewUser from '@/components/dashboard/users/new';

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
    return <NewUser />;
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
