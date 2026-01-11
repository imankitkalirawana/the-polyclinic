'use client';

import React from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { useSession } from '@/lib/providers/session-provider';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faker } from '@faker-js/faker';
import { Icon } from '@iconify/react/dist/iconify.js';

import { GENDERS } from '@/lib/constants';
import { generateEmail, generatePhoneNumber } from '@/lib/utils';

import { useCreateUser } from '@/services/common/user/user.query';
import { CreateUser, createUserSchema, Role } from '@/services/common/user';
import { useQueryState } from 'nuqs';
import DashboardFooter from '@/components/ui/dashboard/footer';
import NewUserFormInputs from './new-user-form-inputs';

export default function NewUser() {
  const router = useRouter();
  const { user } = useSession();
  const createUser = useCreateUser();

  const [redirectUrl] = useQueryState('redirectUrl', {
    defaultValue: '/dashboard/users',
  });

  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: Role.PATIENT,
    },
  });

  const handleAutofill = () => {
    const name = faker.person.fullName();
    form.setValue('name', name);
    form.setValue('email', generateEmail(name));
    form.setValue('phone', generatePhoneNumber());
    form.setValue('gender', faker.helpers.arrayElement(GENDERS));
  };

  const canAutofill = user?.role === Role.ADMIN;

  const onSubmit = async (values: CreateUser) => {
    await createUser.mutateAsync(values);
    router.push(redirectUrl);
  };

  return (
    <Card className="bg-transparent p-2 shadow-none">
      <CardHeader className="items-center justify-between px-4 pb-0 pt-4">
        <div>
          <h1 className="text-large">Add New User</h1>
          <p className="text-default-500 text-tiny">
            Fields with <span className="text-red-500">*</span> are required
          </p>
        </div>
        {canAutofill && (
          <Button
            startContent={<Icon icon="solar:magic-stick-3-bold-duotone" width={16} />}
            variant="flat"
            onPress={handleAutofill}
          >
            Autofill
          </Button>
        )}
      </CardHeader>
      <CardBody>
        <FormProvider {...form}>
          <NewUserFormInputs />
        </FormProvider>
      </CardBody>

      <DashboardFooter>
        <Button
          color="primary"
          radius="full"
          isLoading={createUser.isPending}
          onPress={() => form.handleSubmit(onSubmit)}
          type="submit"
        >
          Create User
        </Button>
      </DashboardFooter>
    </Card>
  );
}
