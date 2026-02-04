'use client';

import React from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button, Card, CardBody, CardHeader, Divider, Form, ScrollShadow } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateUser, useUserProfileByID } from '@/services/common/user/user.query';
import { userFormValuesSchema } from '@/services/common/user/user.validation';
import { Role } from '@/services/common/user/user.constants';
import { useQueryState } from 'nuqs';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import { UserFormValues } from '@/services/common/user/user.types';
import DoctorFields from './doctor-fields';
import PatientFields from './patient-fields';
import DashboardFooter from '@/components/ui/dashboard/footer';
import CommonFields from './common-fields';

export default function EditUser({ id }: { id: string }) {
  const router = useRouter();
  const [redirectUrl] = useQueryState('redirectUrl', {
    defaultValue: '/dashboard/users',
  });

  const { data: profile } = useUserProfileByID(id);
  const updateUser = useUpdateUser();

  const { user, doctor, patient } = profile || {};

  const { control, handleSubmit } = useForm<UserFormValues>({
    resolver: zodResolver(userFormValuesSchema),
    defaultValues: {
      user,
      doctor,
      patient,
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    await updateUser.mutateAsync({
      id,
      data: values,
    });
    router.push(redirectUrl);
  };

  return (
    <Card
      className="bg-transparent p-2 shadow-none"
      as={Form}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit);
      }}
    >
      <CardHeader className="items-center justify-between px-4 pb-0 pt-4">
        <div>
          <h1 className="text-large">Update a User</h1>
          <p className="text-default-500 text-tiny">
            Fields with <span className="text-danger-500">*</span> are required
          </p>
        </div>
        {renderChip({
          item: user?.role || Role.PATIENT,
        })}
      </CardHeader>
      <CardBody>
        <ScrollShadow className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 md:grid-cols-3">
          <CommonFields control={control} />

          {[Role.PATIENT, Role.DOCTOR].includes(user?.role || Role.PATIENT) && (
            <Divider className="col-span-full" />
          )}

          {user?.role === Role.PATIENT && <PatientFields control={control} />}
          {user?.role === Role.DOCTOR && <DoctorFields control={control} />}
        </ScrollShadow>
      </CardBody>

      <DashboardFooter>
        <Button
          color="primary"
          radius="full"
          isLoading={updateUser.isPending}
          onPress={() => handleSubmit(onSubmit)()}
          type="submit"
        >
          Update User
        </Button>
      </DashboardFooter>
    </Card>
  );
}
