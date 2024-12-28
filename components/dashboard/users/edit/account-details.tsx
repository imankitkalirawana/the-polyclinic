'use client';

import React, { useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Avatar,
  Badge,
  Input,
  Autocomplete,
  AutocompleteItem,
  CardFooter,
  Select,
  SelectItem,
  DatePicker,
  ScrollShadow
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import { parseDate, getLocalTimeZone, today } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';

import { CityProps, CountryProps, StateProps } from '@/lib/interface';
import { useFormik } from 'formik';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { getUserWithUID, verifyEmail } from '@/functions/server-actions';
import { Genders } from '@/lib/options';
import { userValidationSchema } from '@/lib/validation';
import { calculateAge, calculateDOB } from '@/lib/client-functions';
import { scrollToError } from '@/lib/formik';
import { UserType } from '@/models/User';
import { useQuery } from '@tanstack/react-query';

export default function AccountDetails({ uid }: { uid: number }) {
  const {
    data: user,
    isError,
    refetch
  } = useQuery<UserType>({
    queryKey: ['user', uid],
    queryFn: () => getUserWithUID(uid)
  });

  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    gender: useRef<HTMLSelectElement>(null),
    age: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
    zipcode: useRef<HTMLInputElement>(null)
  };

  const { data: session } = useSession();

  const formik = useFormik({
    initialValues: {
      user: user as UserType,
      phoneCode: '91',
      age: 0
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      try {
        if (await verifyEmail(values.user?.email, values.user?._id)) {
          formik.setFieldError('user.email', 'Email already exists');
          return;
        }
        await axios.put(`/api/users/uid/${user?.uid}`, values.user);
        toast.success('User updated successfully');
        refetch();
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  });

  useEffect(() => {
    formik.errors?.user && scrollToError(formik.errors?.user, inputRefs);
  }, [formik.isSubmitting]);

  const allowedRoles = ['admin', 'doctor', 'receptionist'];

  if (isError) {
    return <p>Error fetching user data</p>;
  }

  if (!user) return null;

  return (
    <Card className="bg-transparent p-2 shadow-none">
      <CardHeader className="flex flex-col items-start">
        <p className="text-large">Account Details</p>
        <div className="sr-only flex gap-4 py-4">
          <Badge
            classNames={{
              badge: 'w-5 h-5'
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
            <Avatar
              className="h-14 w-14"
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
          </Badge>
          <div className="flex flex-col items-start justify-center">
            <p className="font-medium">{user.name}</p>
            <span className="text-small text-default-500">{user.role}</span>
          </div>
        </div>
        <p className="sr-only text-small text-default-400">
          The photo will be used for your profile, and will be visible to other
          users of the platform.
        </p>
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
        <Input
          ref={inputRefs.name}
          label="Name"
          placeholder="Enter Name"
          name="user.name"
          value={formik.values.user?.name}
          onChange={formik.handleChange}
          isInvalid={
            formik.touched.user?.name && formik.errors.user?.name ? true : false
          }
          errorMessage={formik.touched.user?.name && formik.errors.user?.name}
        />

        <Input
          ref={inputRefs.email}
          label="Email"
          placeholder="Enter email"
          name="user.email"
          value={formik.values.user?.email}
          onChange={(e) => {
            // @ts-ignore
            if (allowedRoles.includes(session?.user?.role)) {
              formik.setFieldValue('user.email', e.target.value);
            }
          }}
          isInvalid={
            formik.touched.user?.email && formik.errors.user?.email
              ? true
              : false
          }
          errorMessage={formik.touched.user?.email && formik.errors.user?.email}
          // @ts-ignore
          isDisabled={!allowedRoles.includes(session?.user?.role)}
          description={
            // @ts-ignore
            !allowedRoles.includes(session?.user?.role) && (
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
          ref={inputRefs.phone}
          label="Phone Number"
          placeholder="Enter phone number"
          name="user.phone"
          onChange={(e) => {
            // @ts-ignore
            if (allowedRoles.includes(session?.user?.role)) {
              formik.setFieldValue('user.phone', e.target.value);
            }
          }}
          isInvalid={
            formik.touched.user?.phone && formik.errors.user?.phone
              ? true
              : false
          }
          errorMessage={formik.touched.user?.phone && formik.errors.user?.phone}
          value={formik.values.user?.phone}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-small text-default-400">
                +{formik.values.phoneCode}
              </span>
            </div>
          }
          // @ts-ignore
          isDisabled={!allowedRoles.includes(session?.user?.role)}
          description={
            // @ts-ignore
            !allowedRoles.includes(session?.user?.role) && (
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
        <Select
          ref={inputRefs.gender}
          label="Gender"
          placeholder="Select Gender"
          selectedKeys={[formik.values.user?.gender]}
          name="user.gender"
          onChange={formik.handleChange}
          isInvalid={
            formik.touched.user?.gender && formik.errors.user?.gender
              ? true
              : false
          }
          errorMessage={
            formik.touched.user?.gender && formik.errors.user?.gender
          }
          items={Genders}
        >
          {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
        </Select>
        <Input
          ref={inputRefs.age}
          label="Age"
          placeholder="Enter Age"
          name="age"
          type="number"
          min={0}
          value={formik.values.age as any}
          onChange={(e) => {
            const age = e.target.value;
            formik.setFieldValue('age', age);
            if (age) {
              formik.setFieldValue('user.dob', calculateDOB(age as any));
            }
          }}
          isInvalid={formik.touched.age && formik.errors.age ? true : false}
          errorMessage={formik.touched.age && formik.errors.age}
        />
        {/* DOB */}
        <I18nProvider locale="en-IN">
          <DatePicker
            label="DOB (DD-MM-YYYY)"
            onChange={(date) => {
              const dob =
                date instanceof Date
                  ? date.toISOString().split('T')[0]
                  : new Date(date as any).toISOString().split('T')[0];
              formik.setFieldValue('user.dob', dob);
              formik.setFieldValue('age', calculateAge(dob));
            }}
            value={parseDate(
              formik.values.user?.dob || new Date().toISOString().split('T')[0]
            )}
            maxValue={today(getLocalTimeZone())}
            showMonthAndYearPickers
          />
        </I18nProvider>

        <Input
          label="Address"
          placeholder="Enter address"
          value={formik.values.user?.address}
          onChange={formik.handleChange}
          name="user.address"
          isInvalid={
            formik.touched.user?.address && formik.errors.user?.address
              ? true
              : false
          }
          errorMessage={
            formik.touched.user?.address && formik.errors.user?.address
          }
        />
        {/* Zip Code */}
        <Input
          label="Zip Code"
          placeholder="Enter zip code"
          value={formik.values.user?.zipcode}
          onChange={formik.handleChange}
          name="user.zipcode"
          isInvalid={
            formik.touched.user?.zipcode && formik.errors.user?.zipcode
              ? true
              : false
          }
          errorMessage={
            formik.touched.user?.zipcode && formik.errors.user?.zipcode
          }
        />
      </CardBody>

      <CardFooter className="mt-4 justify-end gap-2">
        <Button
          radius="full"
          variant="bordered"
          onPress={() => {
            formik.setFieldValue('user', user);
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          radius="full"
          onPress={() => formik.handleSubmit()}
          isLoading={formik.isSubmitting}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
