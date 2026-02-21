import Modal from '@/components/ui/modal';
import { useResetPassword } from '@/services/common/user/user.query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@heroui/react';
import { ResetPasswordDto, resetPasswordSchema } from '@/shared';

export default function ResetPasswordModal({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  userId: string | null;
  onClose: () => void;
}) {
  const { mutateAsync: resetPassword } = useResetPassword();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const renderBody = () => {
    return (
      <>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              autoFocus
              label="Password"
              placeholder="Enter password"
              type="password"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              {...field}
            />
          )}
        />
      </>
    );
  };

  const onSubmit = async (data: ResetPasswordDto) => {
    if (userId) {
      await resetPassword({ id: userId, data });
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reset Password"
      body={renderBody()}
      submitButton={{
        children: 'Reset Password',
        whileSubmitting: 'Resetting password...',
        color: 'warning',
      }}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
