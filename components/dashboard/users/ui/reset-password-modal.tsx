import Modal from '@/components/ui/modal';
import { useResetPassword } from '@/services/common/user/user.query';
import { ResetPasswordRequest } from '@/services/common/user/user.types';
import { useForm, Controller } from 'react-hook-form';
import { resetPasswordSchema } from '@/services/common/user/user.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@heroui/react';

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
  } = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const renderBody = () => {
    return (
      <>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              autoFocus
              label="Password"
              placeholder="Enter password"
              type="password"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...field}
            />
          )}
        />
      </>
    );
  };

  const onSubmit = async (data: ResetPasswordRequest) => {
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
