'use client';

import React from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button, Card, CardBody, CardHeader, Divider, Form, ScrollShadow } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useCreateUser,
  useUpdateUser,
  useUserProfileByID,
} from '@/services/common/user/user.query';
import { userFormValuesSchema } from '@/services/common/user/user.validation';
import { Role } from '@/services/common/user/user.constants';
import { useQueryState } from 'nuqs';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import { UserFormValues } from '@/services/common/user/user.types';
import DoctorFields from './doctor-fields';
import PatientFields from './patient-fields';
import DashboardFooter from '@/components/ui/dashboard/footer';
import CommonFields from './common-fields';

export default function UserForm({ id }: { id?: string }) {
  const router = useRouter();
  const [redirectUrl] = useQueryState('redirectUrl', {
    defaultValue: '/dashboard/users',
  });

  const { data: profile } = useUserProfileByID(id);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const { user, doctor, patient } = profile || {};

  const { control, handleSubmit, watch } = useForm<UserFormValues>({
    resolver: zodResolver(userFormValuesSchema),
    defaultValues: {
      user,
      doctor: {
        ...doctor,
        specializations: doctor?.specializations?.map((specialization) => specialization.id),
      },
      patient,
    },
  });

  const onSubmit = async (values: UserFormValues) => {
    if (id) {
      await updateUser.mutateAsync({
        id,
        data: values,
      });
    } else {
      await createUser.mutateAsync(values);
    }
    router.push(redirectUrl);
  };

  const title = id ? 'Update User' : 'Create a User';

  const role = watch('user.role');

  return (
    <Card
      className="bg-transparent p-2 shadow-none"
      as={Form}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit);
      }}
    >
      <CardHeader className="items-center justify-between px-4 pt-4 pb-0">
        <div>
          <h1 className="text-large">{title}</h1>
          <p className="text-default-500 text-tiny">
            Fields with <span className="text-danger-500">*</span> are required
          </p>
        </div>
        {role &&
          renderChip({
            item: role,
          })}
      </CardHeader>
      <CardBody>
        <ScrollShadow className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 md:grid-cols-3">
          <CommonFields control={control} showRole={!id} />

          {[Role.PATIENT, Role.DOCTOR].includes(role) && <Divider className="col-span-full" />}

          {role === Role.PATIENT && <PatientFields control={control} />}
          {role === Role.DOCTOR && <DoctorFields control={control} />}
        </ScrollShadow>
      </CardBody>

      <DashboardFooter>
        <Button
          color="primary"
          radius="full"
          isLoading={updateUser.isPending || createUser.isPending}
          onPress={() => handleSubmit(onSubmit)()}
          type="submit"
        >
          {id ? 'Update User' : 'Create User'}
        </Button>
      </DashboardFooter>
    </Card>
  );
}
