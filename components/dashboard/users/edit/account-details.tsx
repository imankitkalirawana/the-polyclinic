'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DatePicker,
  Form,
  Input,
} from '@heroui/react';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react';
import { getLocalTimeZone, today } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';

import { userValidationSchema } from '@/lib/validation';
import { useUpdateUser } from '@/hooks/queries/client/user';
import { $FixMe } from '@/types';
import { SystemUserType } from '@/types/system/control-plane';

export default function AccountDetails({ user }: { user: SystemUserType }) {
  const { data: session } = useSession();
  const updateUser = useUpdateUser();

  const formik = useFormik({
    initialValues: user,
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      await updateUser.mutateAsync(values);
    },
  });

  const allowedRoles = ['admin', 'doctor', 'receptionist'];

  if (!user) return null;

  return (
    <Card
      className="bg-transparent p-2 shadow-none"
      as={Form}
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
      }}
    >
      <CardHeader className="flex flex-col items-start">
        <p className="text-large">Account Details</p>
        <div className="sr-only flex gap-4 py-4">
          <Badge
            classNames={{
              badge: 'w-5 h-5',
            }}
            color="primary"
            content={
              <Button
                isIconOnly
                className="p-0 text-primary-foreground"
                radius="full"
                size="sm"
                variant="light"
              >
                <Icon icon="solar:pen-2-linear" />
              </Button>
            }
            placement="bottom-right"
            shape="circle"
          >
            <Avatar className="h-14 w-14" src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
          </Badge>
          <div className="flex flex-col items-start justify-center">
            <p className="font-medium">{user.name}</p>
            <span className="text-small text-default-500">{user.role}</span>
          </div>
        </div>
        <p className="sr-only text-small text-default-400">
          The photo will be used for your profile, and will be visible to other users of the
          platform.
        </p>
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
        <Input
          label="Name"
          placeholder="Enter Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          isInvalid={!!(formik.touched.name && formik.errors.name)}
          errorMessage={formik.touched.name && formik.errors.name}
        />

        <Input
          label="Email"
          placeholder="Enter email"
          name="email"
          value={formik.values.email}
          onBlur={async () => {
            // TODO: Implement email verification
          }}
          onChange={(e) => {
            if (allowedRoles.includes(session?.user?.role || 'user')) {
              formik.setFieldValue('email', e.target.value);
            }
          }}
          isInvalid={!!(formik.touched.email && formik.errors.email)}
          errorMessage={formik.touched.email && formik.errors.email}
          isDisabled={!allowedRoles.includes(session?.user?.role || 'user')}
          description={
            !allowedRoles.includes(session?.user?.role || 'user') && (
              <>
                Please go{session?.role} to{' '}
                <Link
                  href={`/dashboard/users/${user._id}/edit?tab=security-settings`}
                  className="underline"
                >
                  Security tab
                </Link>{' '}
                to update email.
              </>
            )
          }
        />
        <Input
          label="Phone Number"
          placeholder="Enter phone number"
          name="phone"
          onChange={(e) => {
            if (allowedRoles.includes(session?.user?.role || 'user')) {
              formik.setFieldValue('phone', e.target.value);
            }
          }}
          value={formik.values.phone}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-small text-default-400">+91</span>
            </div>
          }
          isDisabled={!allowedRoles.includes(session?.user?.role || 'user')}
          description={
            !allowedRoles.includes(session?.user?.role || 'user') && (
              <>
                Please go{session?.role} to{' '}
                <Link
                  href={`/dashboard/users/${user._id}/edit?tab=security-settings`}
                  className="underline"
                >
                  Security tab
                </Link>{' '}
                to update email.
              </>
            )
          }
          isInvalid={!!(formik.touched.phone && formik.errors.phone)}
          errorMessage={formik.touched.phone && formik.errors.phone}
        />

        {/* DOB */}
        <I18nProvider locale="en-IN">
          <DatePicker
            label="DOB (DD-MM-YYYY)"
            onChange={(date) => {
              const dob =
                // @ts-expect-error - date is not typed
                date instanceof Date
                  ? // @ts-expect-error - date is not typed
                    date.toISOString().split('T')[0]
                  : new Date(date as $FixMe).toISOString().split('T')[0];
              formik.setFieldValue('dob', dob);
            }}
            // value={}
            maxValue={today(getLocalTimeZone())}
            showMonthAndYearPickers
          />
        </I18nProvider>
      </CardBody>

      <CardFooter className="mt-4 justify-end gap-2">
        <Button
          radius="full"
          variant="bordered"
          onPress={() => {
            formik.setValues(user);
          }}
        >
          Cancel
        </Button>
        <Button color="primary" radius="full" isLoading={formik.isSubmitting} type="submit">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
