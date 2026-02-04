'use client';

import React from 'react';
import { useRouter } from 'nextjs-toploader/app';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Input,
  ScrollShadow,
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateUser, useUserProfileByID } from '@/services/common/user/user.query';
import { updateUserSchema } from '@/services/common/user/user.validation';
import { Role } from '@/services/common/user/user.constants';
import { useQueryState } from 'nuqs';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import { UpdateUserRequest } from '@/services/common/user/user.types';
import DoctorFields from './doctor-fields';
import PatientFields from './patient-fields';

export default function EditUser({ id }: { id: string }) {
  const router = useRouter();
  const [redirectUrl] = useQueryState('redirectUrl', {
    defaultValue: '/dashboard/users',
  });

  const { data: profile } = useUserProfileByID(id);
  const updateUser = useUpdateUser();

  const { user, doctor, patient } = profile || {};

  const { control, handleSubmit } = useForm<UpdateUserRequest>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      user,
      doctor,
      patient: {
        ...patient,
        dob: patient?.dob ?? undefined,
      },
    },
  });

  const onSubmit = async (values: UpdateUserRequest) => {
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
        <ScrollShadow className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
          <Controller
            name="user.name"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                isRequired
                label="Name"
                placeholder={user?.role === Role.DOCTOR ? 'eg. Dr. John Doe' : 'eg. John Doe'}
                value={field.value}
                onChange={field.onChange}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="user.email"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                isRequired
                label="Email"
                placeholder="Enter email"
                value={field.value}
                onChange={field.onChange}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="user.phone"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                maxLength={10}
                label="Phone Number"
                placeholder="Enter phone number"
                value={field.value || ''}
                onChange={field.onChange}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">+91</span>
                  </div>
                }
              />
            )}
          />

          {user?.role === Role.PATIENT && <PatientFields control={control} />}
          {user?.role === Role.DOCTOR && <DoctorFields control={control} />}
        </ScrollShadow>
      </CardBody>

      <CardFooter className="mt-4 justify-end gap-2">
        <Button
          color="primary"
          radius="full"
          isLoading={updateUser.isPending}
          onPress={() => handleSubmit(onSubmit)()}
          type="submit"
        >
          Update User
        </Button>
      </CardFooter>
    </Card>
  );
}
