'use client';

import React, { useEffect } from 'react';
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
  CardFooter
} from '@nextui-org/react';
import { Icon } from '@iconify/react';

import { CityProps, CountryProps, StateProps, User } from '@/lib/interface';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import axios from 'axios';
import { getStates } from '@/functions/get';

interface AccountDetailsProps {
  user: User;
  countries: CountryProps[];
}

export default function AccountDetails({
  user,
  countries
}: AccountDetailsProps) {
  const formik = useFormik({
    initialValues: {
      user: user,
      countries: countries.sort((a, b) => a.name.localeCompare(b.name)),
      states: [] as StateProps[],
      cities: [] as CityProps[]
    },
    onSubmit: async (values) => {
      console.log(values);
    }
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${formik.values.user.country}/states`,
          {
            headers: {
              'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY
            }
          }
        );
        formik.setFieldValue(
          'states',
          response.data.sort((a: StateProps, b: StateProps) =>
            a.name.localeCompare(b.name)
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (formik.values.user.country) {
      fetchStates();
    }
  }, [formik.values.user.country]);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${formik.values.user.country}/states/${formik.values.user.state}/cities`,
          {
            headers: {
              'X-CSCAPI-KEY': process.env.NEXT_PUBLIC_CSCAPI_KEY
            }
          }
        );
        formik.setFieldValue(
          'cities',
          response.data.sort((a: CityProps, b: CityProps) =>
            a.name.localeCompare(b.name)
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (formik.values.user.country && formik.values.user.state) {
      fetchCities();
    }
  }, [formik.values.user.state, formik.values.user.country]);

  console.log(formik.values.user.country);

  return (
    <Card className="bg-transparent p-2 shadow-none">
      <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
        <p className="text-large">Account Details</p>
        <div className="flex gap-4 py-4">
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
        <p className="text-small text-default-400">
          The photo will be used for your profile, and will be visible to other
          users of the platform.
        </p>
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Name"
          labelPlacement="outside"
          placeholder="Enter Name"
          name="user.name"
          value={formik.values.user.name}
          onChange={formik.handleChange}
          isInvalid={
            formik.touched.user?.name && formik.errors.user?.name ? true : false
          }
          errorMessage={formik.touched.user?.name && formik.errors.user?.name}
        />
        <Input
          label="Email"
          labelPlacement="outside"
          placeholder="Enter email"
          name="user.email"
          value={formik.values.user.email}
          onChange={formik.handleChange}
          isInvalid={
            formik.touched.user?.email && formik.errors.user?.email
              ? true
              : false
          }
          errorMessage={formik.touched.user?.email && formik.errors.user?.email}
          isDisabled
          description={
            <>
              Please go to{' '}
              <Link
                href={`/dashboard/users/${user._id}/edit?tab=security-settings`}
                className="underline"
              >
                Security tab
              </Link>{' '}
              to update email.
            </>
          }
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          labelPlacement="outside"
          placeholder="Enter phone number"
          name="user.phone"
          value={formik.values.user.phone}
          onChange={formik.handleChange}
          isInvalid={
            formik.touched.user?.phone && formik.errors.user?.phone
              ? true
              : false
          }
        />
        {/* Country */}
        <Autocomplete
          defaultItems={formik.values.countries}
          label="Country"
          labelPlacement="outside"
          placeholder="Select country"
          showScrollIndicators={false}
          onSelectionChange={(value) => {
            formik.setFieldValue('user.country', value);
          }}
          selectedKey={formik.values.user.country}
        >
          {(item) => (
            <AutocompleteItem key={item.iso2} startContent={<>{item.emoji}</>}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        {/* State */}
        <Autocomplete
          defaultItems={formik.values.states}
          label="State"
          labelPlacement="outside"
          placeholder="Select state"
          showScrollIndicators={false}
          isDisabled={formik.values?.states?.length < 1}
          onSelectionChange={(value) => {
            formik.setFieldValue('user.state', value);
          }}
          selectedKey={formik.values.user.state}
        >
          {(item) => (
            <AutocompleteItem key={item.iso2} value={item.iso2}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        {/* City */}
        <Autocomplete
          defaultItems={formik.values.cities}
          label="City"
          labelPlacement="outside"
          placeholder="Select city"
          showScrollIndicators={false}
          isDisabled={formik.values?.states?.length < 1}
          onSelectionChange={(value) => {
            formik.setFieldValue('user.city', value);
          }}
          selectedKey={formik.values.user.city}
        >
          {(item) => (
            <AutocompleteItem key={item.id} value={item.id}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        {/* Address */}
        <Input
          label="Address"
          labelPlacement="outside"
          placeholder="Enter address"
        />
        {/* Zip Code */}
        <Input
          label="Zip Code"
          labelPlacement="outside"
          placeholder="Enter zip code"
        />
      </CardBody>

      <CardFooter className="mt-4 justify-end gap-2">
        <Button radius="full" variant="bordered">
          Cancel
        </Button>
        <Button color="primary" radius="full">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
