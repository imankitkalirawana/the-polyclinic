import Modal from '@/components/ui/modal';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserRequest } from '@/services/common/user/user.types';
import { createUserSchema } from '@/services/common/user/user.validation';
import { useCreateUser } from '@/services/common/user/user.query';
import NewUserForm from '@/components/dashboard/users/new/new-user-form';
import { Role } from '@/services/common/user/user.constants';
import { addToast } from '@heroui/react';

export default function NewPatient({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: (id: string) => void;
}) {
  const form = useForm<CreateUserRequest>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: Role.PATIENT,
    },
  });

  const { mutateAsync: createUser } = useCreateUser({ showToast: false });

  const onSubmit = async (data: CreateUserRequest) => {
    await createUser(data).then((response) => {
      if (response.data?.linked_id) {
        onSuccess?.(response.data.linked_id);
      } else {
        addToast({
          title: 'An error occurred',
          description: 'Failed to create patient. Please try again later.',
          color: 'danger',
        });
      }
    });
  };

  const renderBody = () => {
    return (
      <FormProvider {...form}>
        <NewUserForm lockRole />
      </FormProvider>
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
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
}
