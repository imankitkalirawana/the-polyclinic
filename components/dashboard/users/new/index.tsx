'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DatePicker,
  Input,
  ScrollShadow,
  Select,
  SelectItem,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getLocalTimeZone, today } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { calculateAge, calculateDOB } from '@/lib/client-functions';
import { scrollToError } from '@/lib/formik';
import { CityProps, CountryProps, StateProps } from '@/types';
import { Genders } from '@/lib/options';
import { userValidationSchema } from '@/lib/validation';
import { CreateUserType } from '@/types/user';
import {
  useAllCitiesByCountryAndState,
  useAllCountries,
  useAllStatesByCountry,
} from '@/services/external';
import { useCreateUser } from '@/services/user';

export default function NewUser() {
  const router = useRouter();
  const createUser = useCreateUser();
  const { data: countriesData, isLoading: isCountriesLoading } =
    useAllCountries();
  const countries: CountryProps[] = countriesData || [];

  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    gender: useRef<HTMLSelectElement>(null),
    age: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
    zipcode: useRef<HTMLInputElement>(null),
  };

  const formik = useFormik({
    initialValues: {
      user: {} as CreateUserType,
      age: 0,
      countries:
        countries?.sort((a, b) => a.name.localeCompare(b.name)) ||
        ([] as CountryProps[]),
      states: [] as StateProps[],
      cities: [] as CityProps[],
      phoneCode: '91',
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      await createUser.mutateAsync(values.user).then(() => {
        router.push('/dashboard/users');
      });
    },
  });

  const { data: statesData, isLoading: isStatesLoading } =
    useAllStatesByCountry(formik.values.user.country);

  const { data: citiesData, isLoading: isCitiesLoading } =
    useAllCitiesByCountryAndState(
      formik.values.user.country,
      formik.values.user.state
    );

  const states: StateProps[] = statesData || [];
  const cities: CityProps[] = citiesData || [];

  useEffect(() => {
    if (formik.errors?.user && Object.keys(formik.errors.user).length > 0) {
      scrollToError(formik.errors.user, inputRefs);
    }
  }, [formik.errors]);

  return (
    <>
      <Card className="bg-transparent p-2 shadow-none">
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Add New UserType</p>
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
              <Avatar
                className="h-14 w-14"
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
              />
            </Badge>
            <div className="flex flex-col items-start justify-center">
              <p className="font-medium">{formik.values.user.name}</p>
              <span className="text-small text-default-500">
                {formik.values.user.role}
              </span>
            </div>
          </div>
          <p className="sr-only text-small text-default-400">
            The photo will be used for your profile, and will be visible to
            other users of the platform.
          </p>
        </CardHeader>
        <CardBody>
          <ScrollShadow className="grid grid-cols-1 gap-4 p-1 md:grid-cols-2">
            <Input
              ref={inputRefs.name}
              label="Name"
              placeholder="Enter Name"
              name="user.name"
              value={formik.values.user.name}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.user?.name && formik.errors.user?.name
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.user?.name && formik.errors.user?.name
              }
            />
            <Input
              label="Email"
              ref={inputRefs.email}
              placeholder="Enter email"
              name="user.email"
              value={formik.values.user.email}
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.user?.email && formik.errors.user?.email
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.user?.email && formik.errors.user?.email
              }
            />
            <Input
              label="Phone Number"
              ref={inputRefs.phone}
              placeholder="Enter phone number"
              name="user.phone"
              onChange={formik.handleChange}
              isInvalid={
                formik.touched.user?.phone && formik.errors.user?.phone
                  ? true
                  : false
              }
              errorMessage={
                formik.touched.user?.phone && formik.errors.user?.phone
              }
              value={formik.values.user.phone}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-small text-default-400">
                    +{formik.values.phoneCode}
                  </span>
                </div>
              }
            />
            <Select
              label="Gender"
              ref={inputRefs.gender}
              placeholder="Select Gender"
              selectedKeys={[formik.values.user.gender]}
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
            <I18nProvider locale="en-IN">
              <DatePicker
                label="DOB (DD-MM-YYYY)"
                onChange={(date) => {
                  const dob =
                    // @ts-ignore
                    date instanceof Date
                      ? // @ts-ignore
                        date.toISOString().split('T')[0]
                      : new Date(date as any).toISOString().split('T')[0];
                  formik.setFieldValue('user.dob', dob);
                  formik.setFieldValue('age', calculateAge(dob));
                }}
                maxValue={today(getLocalTimeZone())}
                showMonthAndYearPickers
              />
            </I18nProvider>
            <Autocomplete
              isLoading={isCountriesLoading}
              defaultItems={countries}
              label="Country"
              className="grid-cols-2 bg-gradient-to-b"
              placeholder="Select country"
              showScrollIndicators={false}
              onSelectionChange={(value) => {
                formik.setFieldValue('user.country', value);
              }}
              selectedKey={formik.values.user.country}
            >
              {(item) => (
                <AutocompleteItem
                  key={item.iso2}
                  startContent={<>{item.emoji}</>}
                >
                  {item.name}
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Autocomplete
              isLoading={isStatesLoading}
              defaultItems={states}
              label="State"
              placeholder="Select state"
              showScrollIndicators={false}
              onSelectionChange={(value) => {
                formik.setFieldValue('user.state', value);
              }}
              selectedKey={formik.values.user.state}
            >
              {(item) => (
                <AutocompleteItem key={item.iso2}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
            <Autocomplete
              isLoading={isCitiesLoading}
              defaultItems={cities}
              label="City"
              placeholder="Select city"
              showScrollIndicators={false}
              onSelectionChange={(value) => {
                formik.setFieldValue('user.city', value);
              }}
              selectedKey={formik.values.user.city}
            >
              {(item) => (
                <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>
              )}
            </Autocomplete>
            <Input
              label="Address"
              placeholder="Enter address"
              value={formik.values.user.address}
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
            <Input
              label="Zip Code"
              placeholder="Enter zip code"
              value={formik.values.user.zipcode}
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
          </ScrollShadow>
        </CardBody>

        <CardFooter className="mt-4 justify-end gap-2">
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
    </>
  );
}
