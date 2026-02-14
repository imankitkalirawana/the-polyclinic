'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@heroui/react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { emailValidation, passwordValidation } from '@/utils/factories/validation.factory';
import { APP_INFO } from '@/libs/config';
import { AuthFormLayout } from '../shared';
import AuthEmailInput from '../ui/auth-email.input';
import AuthPasswordInput from '../ui/auth-password.input';
import { useForgotPassword } from '@/services/common/auth/auth.query';

const forgotPasswordSchema = z.object({
  user: z.object({
    email: emailValidation,
    password: passwordValidation,
  }),
  meta: z.object({
    page: z.number().min(0).max(1),
  }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const FORGOT_STEP_0 = {
  title: 'Reset your password',
  description: `Enter the email address for your ${APP_INFO.name} account. You'll then set a new password.`,
  button: 'Continue',
};

const FORGOT_STEP_1 = {
  title: 'Enter new password',
  description: 'Choose a new password for your account.',
  button: 'Reset password',
};

export default function ForgotPassword(): React.ReactElement {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') ?? '';
  const { mutateAsync: resetPassword, isSuccess: isResetSuccess } = useForgotPassword();

  const defaultValues = useMemo<ForgotPasswordFormValues>(
    () => ({
      user: { email: emailFromUrl, password: '' },
      meta: { page: 0 },
    }),
    [emailFromUrl]
  );

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
  });

  const meta = useWatch({
    control: form.control,
    name: 'meta',
    defaultValue: { page: 0 },
  });

  const currentStep = meta.page === 0 ? FORGOT_STEP_0 : FORGOT_STEP_1;

  const onSubmit = async (data: ForgotPasswordFormValues): Promise<void> => {
    if (data.meta.page === 0) {
      form.setValue('meta.page', 1);
      return;
    }
    await resetPassword({
      email: data.user.email,
    });
  };

  const formContent =
    meta.page === 0 ? (
      <AuthEmailInput control={form.control} name="user.email" />
    ) : (
      <>
        <AuthEmailInput control={form.control} name="user.email" isReadOnly />
        <AuthPasswordInput control={form.control} name="user.password" />
      </>
    );

  const footer = (
    <>
      <div className="flex items-center gap-2">
        <div className="bg-divider h-px w-full" />
        <div className="text-default-500 text-small">or</div>
        <div className="bg-divider h-px w-full" />
      </div>
      <div className="text-small text-center">
        Remember your password?&nbsp;
        <Link href={`/auth/login?email=${form.getValues('user.email') ?? ''}`} size="sm">
          Log in
        </Link>
      </div>
    </>
  );

  return (
    <AuthFormLayout
      stepKey={meta.page}
      title={currentStep.title}
      description={currentStep.description}
      isBack={meta.page > 0}
      onBack={() => form.setValue('meta.page', 0)}
      formContent={formContent}
      submitLabel={currentStep.button}
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      isSubmitDisabled={isResetSuccess}
      footer={footer}
    />
  );
}
