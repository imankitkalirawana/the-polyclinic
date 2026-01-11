import Modal from '@/components/ui/modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import NewUser from '@/components/dashboard/users/new';
import { CreateUserRequest } from '@/services/common/user/user.types';
import { createUserSchema } from '@/services/common/user/user.validation';
import { useCreateUser } from '@/services/common/user/user.query';

export default function NewPatient({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: (id: string) => void;
}) {
  const form = useForm<CreateUserRequest>({
    resolver: zodResolver(createUserSchema),
  });

  const { mutate: createUser } = useCreateUser();

  const onSubmit = (data: CreateUserRequest) => {
    createUser(data);
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
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
}
